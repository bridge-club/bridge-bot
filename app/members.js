var Members = function() {
  this.memberList = [];
  this.selectedMemberIndex = -1;
};

Members.prototype.getMemberList = function(membersMap) {
  var membersData = JSON.parse(membersMap);
  for (var i=0; i<membersData.members.length; i++) {
    this.memberList.push(membersData.members[i]);
  }
};

Members.prototype.selectNextMember = function() {
  this.selectedMemberIndex++;
};

Members.prototype.getEmailAddressFor = function(index) {
  return this.memberList[index].email;
};

Members.prototype.getAllEmailAddresses = function() {
  var emailAddresses = [];
  this.memberList.forEach(function(member) {
    emailAddresses.push(member.email);
  });
  return emailAddresses.join(", ");
};

module.exports = Members;