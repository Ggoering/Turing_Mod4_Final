exports.seed = function(knex, Promise) {
  return knex('garage_items').del()
    .then(function () {
      return knex('garage_items').insert([
        {id: 1, name: 'Luna', reason: 'BAD DOG', cleanliness: 'Dusty'},
        {id: 2, name: 'bicycle', reason: 'too scary', cleanliness: 'Dusty'},
        {id: 3, name: 'old clothes', reason: 'too lazy to donate', cleanliness: 'Sparkling'},
        {id: 4, name: 'monitor', reason: 'wanted 144hz', cleanliness: 'Sparkling'},
        {id: 5, name: 'tools', reason: 'I will use them someday', cleanliness: 'Sparkling'},
        {id: 6, name: 'recycling', reason: 'too lazy to go to dump', cleanliness: 'Rancid'},
      ]);
    });
};