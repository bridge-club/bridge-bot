var Members = require('../app/members.js');

describe('selecting Bridge Club members', function() {
  
  var membersFileMock = "{\"members\": [{\"id\": 1,\"name\": \"Carla\",\"surname\": \"Azar\",\"email\": \"carla@azar.com\"},{\"id\": 2,\"name\": \"Chris\",\"surname\": \"Corsano\",\"email\": \"chris@cor.sano.com\"},{\"id\": 3,\"name\": \"Milford\",\"surname\": \"Graves\",\"email\": \"milford@graves.com\"}]}";
  
  beforeEach(function(){
    members = new Members();
  });

  describe('initialization', function() {
    it('has a member list', function() {
      expect(members.memberList).toEqual([]);
    });
  });

  describe('getting the memberlist from a file', function() {
    it('can populate the memberlist', function() {
      members.getMemberList(membersFileMock);
      expect(members.memberList[0].name).toEqual("Carla");
      expect(members.memberList[1].surname).toEqual("Corsano");
      expect(members.memberList[2].email).toEqual("milford@graves.com");
    });
  });

  describe('selecting a member', function() {
    it('remembers the selected member', function() {
      expect(members.selectedMemberIndex).toEqual(-1);
    });

    it('selects the first member index', function() {  
      members.selectNextMember();
      expect(members.selectedMemberIndex).toEqual(0);
    });

    it("can look up the next member's details", function() {
      members.getMemberList(membersFileMock);
      members.selectNextMember();
      members.selectNextMember();
      var expectedMember = members.memberList[members.selectedMemberIndex];
      var expectedMemberName = expectedMember.name;
      var expectedMemberEmail = expectedMember.email;
      expect(expectedMemberName).toEqual("Chris");
      expect(expectedMemberEmail).toEqual("chris@cor.sano.com");
    });
  });

  describe("getting the relevant email addresses", function() {
    it("can get one member's email address", function() {
      members.getMemberList(membersFileMock);
      var actual = members.getEmailAddressFor(0);
      var expected = "carla@azar.com"
      expect(actual).toEqual(expected);
    });

    it("can get all of the members' email addresses", function() {
      members.getMemberList(membersFileMock);
      var actual = members.getAllEmailAddresses();
      var expected = "carla@azar.com, chris@cor.sano.com, milford@graves.com"
      expect(actual).toEqual(expected);
    });
  });
});