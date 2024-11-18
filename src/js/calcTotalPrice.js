export const calcTotalPrice = items => {
  return items.reduce((sum, obj) => (obj.available ? obj.price * obj.count + sum : 0 + sum), 0);
};
