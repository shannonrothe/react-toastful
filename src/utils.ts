export const nextId = (() => {
  let id = 0;
  return () => {
    return (++id).toString();
  };
})();
