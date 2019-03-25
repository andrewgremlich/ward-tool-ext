console.log('The ward tools extension has been initiated.  Good to go!');

const AppPanel = document.querySelector("[class*='AppPanel']");

console.log(AppPanel);

const downloadLink = document.createElement("a"),
  downloadButton = document.createElement("button"),
  ExtensionPanel = document.createElement("div");

downloadButton.innerText = "Download whole ward";
downloadButton.style.cssText = `
  position: fixed;
  bottom: 10px;
  right: 300px;
  font-size: 20px;
  padding: 10px;
  background: #325184;
  color: #f4f4f4;
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

downloadButton.addEventListener('click', fetchUserInfo);

document.querySelector("body").appendChild(downloadButton);
