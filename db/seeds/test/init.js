exports.seed = function(knex, Promise) {
  return knex('garage_items').del()
    .then(function () {
      return knex('garage_items').insert([
        {name: 'Luna', reason: 'BAD DOG', cleanliness: 'Dusty'},
        {name: 'bicycle', reason: 'too scary', cleanliness: 'Dusty'},
        {name: 'old clothes', reason: 'too lazy to donate', cleanliness: 'Sparkling'},
        {name: 'monitor', reason: 'wanted 144hz', cleanliness: 'Sparkling'},
        {name: 'tools', reason: 'I will use them someday', cleanliness: 'Sparkling'},
        {name: 'recycling', reason: 'too lazy to go to dump', cleanliness: 'Rancid'},
      ]);
    });
};