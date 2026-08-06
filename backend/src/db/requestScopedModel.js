import { AsyncLocalStorage } from "node:async_hooks";

/**
 * Modelos ligados a la conexión del request en curso.
 *
 * Cada request abre su propia conexión (ver connection.js). Para no tener que
 * pasarla a mano por todos los controladores, se guarda en un
 * AsyncLocalStorage y los modelos se resuelven contra ella al vuelo: los
 * controladores siguen escribiendo `foodModel.find(...)` sin enterarse.
 */
export const connectionStore = new AsyncLocalStorage();

/**
 * @param {string} name   nombre de la colección en mongoose
 * @param {import('mongoose').Schema} schema
 */
export const requestScopedModel = (name, schema) => {
  const resolve = () => {
    const connection = connectionStore.getStore();
    if (!connection) {
      throw new Error(`No hay conexión activa al usar el modelo ${name}`);
    }
    // El esquema se compila una sola vez por conexión.
    return connection.models[name] ?? connection.model(name, schema);
  };

  // El target es una función para que `new Model()` también funcione.
  return new Proxy(function () {}, {
    get: (_target, prop) => {
      const model = resolve();
      const value = model[prop];
      return typeof value === "function" ? value.bind(model) : value;
    },
    set: (_target, prop, value) => {
      resolve()[prop] = value;
      return true;
    },
    has: (_target, prop) => prop in resolve(),
    construct: (_target, args) => new (resolve())(...args),
    apply: (_target, _thisArg, args) => new (resolve())(...args),
  });
};
