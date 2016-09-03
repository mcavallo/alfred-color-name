function Alfred() {
  this.output = {
    items: []
  };
}

Alfred.prototype.addItem = function(item) {
  this.output.items.push(item);
};

Alfred.prototype.override = function(item) {
  this.output.items = [item];
};

Alfred.prototype.send = function() {
  process.stdout.write(JSON.stringify(this.output));
};

Alfred.prototype.end = function() {
  this.send();
  process.exit(0);
};

Alfred.prototype.return = function(item) {
  this.addItem(item);
  this.end();
};

module.exports = (new Alfred());
