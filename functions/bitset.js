function hasPermissions(permissionsValue, permissionToCheck) {
  const binaryPermissions = (permissionsValue >>> 0).toString(2);

  console.log(binaryPermissions)
  
  return binaryPermissions[binaryPermissions.length - permissionToCheck] === '1';
}

module.exports = { hasPermissions };