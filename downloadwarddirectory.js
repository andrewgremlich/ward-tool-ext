console.log('The ward tools extension has been initiated.  Good to go!');

const BarButtons = document.querySelector("[class*='BarButtons']");

const downloadLink = document.createElement("a"),
  ExtensionButton = document.createElement("button");

BarButtons.insertBefore(ExtensionButton, BarButtons.firstChild);

ExtensionButton.title = "Download ward data";

ExtensionButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
`;

ExtensionButton.style.cssText = `
  border: none;
  background: white;
`;

let trimmedDirectory = [];

const trimHouseholdData = ({
  name,
  phone,
  email,
  members
}) => {
  members.forEach(({
    name: memberName,
    email: memberEmail,
    phone: memberPhone,
    positions
  }) => {
    let memberToDirectory = {}

    if (memberName) {
      memberToDirectory.name = memberName
    } else {
      memberToDirectory.name = name
    }

    if (memberPhone) {
      memberToDirectory.phone = memberPhone
    } else {
      memberToDirectory.phone = phone
    }

    if (memberEmail) {
      memberToDirectory.email = memberEmail
    } else {
      memberToDirectory.email = email
    }

    memberToDirectory.positions = positions && positions.map(({
      positionTypeName
    }) => ({
      positionTypeName
    }))

    trimmedDirectory.push(memberToDirectory)
  })
}

const processWardData = data => {
  console.log("Got directory data!  Trimming data...");

  data.forEach(trimHouseholdData);

  downloadLink.href = 'data:application/json;charset=utf8,' + encodeURIComponent(JSON.stringify(trimmedDirectory))
  downloadLink.download = "ward_directory.json";
  downloadLink.click();

  console.log("Downloading...  See the download?");
}

const fetchWard = data => {
  console.log("Got user info!");

  let homeUnitId = data.homeUnits[0];
  let unitString = `https://directory-beta.lds.org/api/v4/households?unit=${homeUnitId}`;

  console.log("Your unit Id is " + homeUnitId);
  console.log("API URL is " + unitString);

  fetch(unitString)
    .then(d => d.json())
    .then(processWardData)
    .catch(err => console.warn(err));
}

const fetchUserInfo = () => {
  fetch("https://directory-beta.lds.org/api/v4/user")
    .then(d => d.json())
    .then(fetchWard)
    .catch(err => console.warn(err));
}

ExtensionButton.addEventListener('click', fetchUserInfo);
