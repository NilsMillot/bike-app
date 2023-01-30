let availableSellers = [];

exports.addAvailableSeller = ({ id, nameSeller }) => {
  if (!nameSeller) return { error: "Username is required." };

  const seller = { id, nameSeller };

  availableSellers.push(seller);

  return { seller };
};

exports.removeAvailableSeller = (id) => {
  const index = availableSellers.findIndex((seller) => seller.id !== id);
  removedSeller = availableSellers[index];

  availableSellers.splice(index, 1);

  return removedSeller;
};

exports.availableSellers = availableSellers;
