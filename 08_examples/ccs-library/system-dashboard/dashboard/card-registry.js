/**
 * PrismDashboard — Agent-accessible card registry
 * 
 * Agents can call:
 *   PrismDashboard.setData(cardId, payload)   — push data into a card
 *   PrismDashboard.getData(cardId)             — read current card state
 *   PrismDashboard.getSchema(cardId)           — get card data schema
 *   PrismDashboard.subscribe(cardId, fn)       — listen for data changes
 *   PrismDashboard.listCards()                 — enumerate all registered cards
 *   PrismDashboard.broadcast(event, payload)   — send event to all cards
 *   PrismDashboard.getHistory(cardId, limit)   — audit log of data pushes
 */
window.PrismDashboard = (() => {
  const _reg      = {};   // cardId -> { name, schema, getData, setData, onBroadcast }
  const _listeners = {};  // cardId -> [fn, ...]
  const _history   = {};  // cardId -> [{ ts, data }, ...]

  return {
    register(id, instance) {
      _reg[id]     = instance;
      _history[id] = _history[id] || [];
      console.debug('[PrismDashboard] registered:', id);
    },

    unregister(id) {
      delete _reg[id];
      delete _listeners[id];
    },

    /** Push data into a card — primary agent entry point */
    setData(id, data) {
      if (!_reg[id]) { console.warn('[PrismDashboard] unknown card:', id); return false; }
      _history[id].push({ ts: Date.now(), data });
      _reg[id].setData(data);
      (_listeners[id] || []).forEach(fn => fn(data, id));
      return true;
    },

    /** Read the card's current data */
    getData(id) {
      return _reg[id] ? _reg[id].getData() : null;
    },

    /** Get the JSON schema describing what data a card accepts */
    getSchema(id) {
      return _reg[id] ? (_reg[id].schema || null) : null;
    },

    /** Subscribe to data changes; returns unsubscribe function */
    subscribe(id, fn) {
      if (!_listeners[id]) _listeners[id] = [];
      _listeners[id].push(fn);
      return () => { _listeners[id] = _listeners[id].filter(f => f !== fn); };
    },

    /** List every registered card with id, name, schema */
    listCards() {
      return Object.entries(_reg).map(([id, inst]) => ({
        id,
        name:   inst.name   || id,
        schema: inst.schema || null,
      }));
    },

    /** Broadcast a named event to all cards (e.g. period change) */
    broadcast(event, payload) {
      Object.entries(_reg).forEach(([, inst]) => {
        inst.onBroadcast && inst.onBroadcast(event, payload);
      });
    },

    /** Audit log — last `limit` data pushes for a card */
    getHistory(id, limit = 50) {
      return (_history[id] || []).slice(-limit);
    },
  };
})();
