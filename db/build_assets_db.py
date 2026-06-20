"""
Build assets.db SQLite database from HowieZZ asset archive.
Run: python build_assets_db.py
"""

import sqlite3
import json
import os
import re
from pathlib import Path

ASSETS_ROOT = Path(r"C:\Users\kas41\archived\HowieZZ\assets")
DATA_DIR = ASSETS_ROOT / "data"
OPTIONS_DIR = ASSETS_ROOT / "Options"
DB_PATH = Path(r"C:\.05_Chromatic_Design_Studios\db\assets.db")

SERIES_MAP = {
    "GE": "I-Series",
    "ZX": "SLE-Series",
    "ZF": "Fusion-Series",
    "KE": "K-Series",
    "ZK": "K-Series",
    "ZD": "Z-Series",
}


def detect_series(code: str) -> str:
    prefix = re.match(r"^([A-Z]+)", code)
    if prefix:
        return SERIES_MAP.get(prefix.group(1), "Other")
    return "Other"


def build_db():
    if DB_PATH.exists():
        DB_PATH.unlink()

    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()

    cur.executescript("""
        CREATE TABLE series (
            id   INTEGER PRIMARY KEY,
            name TEXT UNIQUE NOT NULL
        );

        CREATE TABLE products (
            id           INTEGER PRIMARY KEY,
            code         TEXT UNIQUE NOT NULL,
            series_id    INTEGER REFERENCES series(id),
            asset_count  INTEGER DEFAULT 0
        );

        CREATE TABLE product_assets (
            id         INTEGER PRIMARY KEY,
            product_id INTEGER REFERENCES products(id),
            filename   TEXT NOT NULL,
            sequence   INTEGER,
            media_type TEXT,
            rel_path   TEXT NOT NULL
        );

        CREATE TABLE options (
            id         INTEGER PRIMARY KEY,
            opt_type   TEXT NOT NULL,   -- 'Body' or 'Head'
            category   TEXT NOT NULL,
            value_name TEXT NOT NULL,
            image_path TEXT NOT NULL
        );

        CREATE TABLE personas (
            id           INTEGER PRIMARY KEY,
            display_name TEXT NOT NULL,
            archetype    TEXT,
            character    TEXT,
            body_code    TEXT,
            weight_kg    REAL
        );

        CREATE TABLE persona_library (
            id         INTEGER PRIMARY KEY,
            persona_id INTEGER REFERENCES personas(id),
            image_path TEXT NOT NULL
        );

        CREATE INDEX idx_product_assets_pid ON product_assets(product_id);
        CREATE INDEX idx_options_type_cat   ON options(opt_type, category);
    """)

    # ── Series seed ──────────────────────────────────────────────────────────
    for name in ["I-Series", "K-Series", "SLE-Series", "Fusion-Series", "Z-Series", "Other"]:
        cur.execute("INSERT OR IGNORE INTO series(name) VALUES (?)", (name,))

    series_ids = {row[0]: row[1] for row in cur.execute("SELECT name, id FROM series")}

    # ── Products + product_assets from data/*.json ───────────────────────────
    json_files = list(DATA_DIR.glob("*.json"))
    print(f"Loading {len(json_files)} product JSON files…")

    skipped_personas = 0
    for jf in json_files:
        try:
            with open(jf, encoding="utf-8") as f:
                data = json.load(f)
        except (json.JSONDecodeError, OSError):
            continue

        # k-series-personas.json has a different shape — handle separately
        if "personas" in data:
            skipped_personas += 1
            continue

        code = data.get("code", jf.stem)
        series_name = detect_series(code)
        series_id = series_ids.get(series_name, series_ids["Other"])
        assets = data.get("assets", [])

        cur.execute(
            "INSERT OR IGNORE INTO products(code, series_id, asset_count) VALUES (?,?,?)",
            (code, series_id, len(assets)),
        )
        product_id = cur.execute("SELECT id FROM products WHERE code=?", (code,)).fetchone()[0]

        rows = [
            (product_id, a.get("filename"), a.get("sequence"), a.get("media_type"), a.get("rel_path", ""))
            for a in assets
        ]
        cur.executemany(
            "INSERT INTO product_assets(product_id, filename, sequence, media_type, rel_path) VALUES (?,?,?,?,?)",
            rows,
        )

    # ── Options from Options/ directory ──────────────────────────────────────
    print("Loading options…")
    for type_dir in OPTIONS_DIR.iterdir():
        if not type_dir.is_dir():
            continue
        opt_type = "Head" if "Head" in type_dir.name else "Body"
        for cat_dir in type_dir.iterdir():
            if not cat_dir.is_dir():
                continue
            category = cat_dir.name
            for img in cat_dir.glob("*"):
                if img.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
                    rel = img.relative_to(ASSETS_ROOT).as_posix()
                    cur.execute(
                        "INSERT INTO options(opt_type, category, value_name, image_path) VALUES (?,?,?,?)",
                        (opt_type, category, img.stem, rel),
                    )

    # ── Personas from k-series-personas.json ─────────────────────────────────
    personas_file = DATA_DIR / "k-series-personas.json"
    if personas_file.exists():
        print("Loading personas…")
        with open(personas_file, encoding="utf-8") as f:
            pdata = json.load(f)
        for key, p in pdata.get("personas", {}).items():
            cur.execute(
                "INSERT INTO personas(display_name, archetype, character, body_code, weight_kg) VALUES (?,?,?,?,?)",
                (p.get("displayName", key), p.get("archetype"), p.get("character"), p.get("body"), p.get("weightKg")),
            )
            pid = cur.lastrowid
            for img in p.get("library", []):
                cur.execute("INSERT INTO persona_library(persona_id, image_path) VALUES (?,?)", (pid, img))

    con.commit()

    # ── Summary ──────────────────────────────────────────────────────────────
    print("\n=== assets.db build complete ===")
    for table in ["series", "products", "product_assets", "options", "personas", "persona_library"]:
        count = cur.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        print(f"  {table:<20} {count:>6} rows")

    print(f"\nDB written to: {DB_PATH}")
    con.close()


if __name__ == "__main__":
    build_db()
