var Dropbox = require('../app/dropbox.js');
var util = require('util');

describe('accessing Dropbox.', function() {

  beforeEach(function() {
    dropbox = new Dropbox();
  });

// TODO:
// Write the whole thing again test-first. 
// These aren't real tests (no assertions), and this is really just a spike. 

  describe('An existing file', function() {
    it('can be updated', function() {
      dropbox.writeFile("test.txt", "Cleaning this week: Jeremy Corbyn", true);
    });  
  });

  describe('A new file', function() {
    it('can be written', function() {
      dropbox.writeFile("test2.txt", "Cleaning this week: Ghostface Killah", true);
    });  
  });

  describe("Reading", function() {
    it("test.txt", function() {
      dropbox.readFile("test.txt");
    });
  });
});