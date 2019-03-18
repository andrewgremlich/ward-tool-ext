console.log('hello world from extension!');

const downloadLink = document.createElement("a");
const downloadButton = document.createElement("button");

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

downloadButton.onclick = () => {

  fetch("https://directory-beta.lds.org/api/v4/user", {
      credentials: "same-origin"
    }).then(d => d.json())
    .then(data => {

      console.log("Got user info!");

      let homeUnitId = data.homeUnits[0];

      homeUnitId && console.log("Unit ID is good!");

      fetch(`https://directory-beta.lds.org/api/v4/households?unit=${homeUnitId}`, {
          credentials: "same-origin"
        }).then(d => d.json())
        .then(data => {
          console.log(data);
          console.log("Got directory data!  Trimming data...");

          let trimmedDirectory = [];

          data.forEach(({
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
          })

          downloadLink.href = 'data:application/json;charset=utf8,' + encodeURIComponent(JSON.stringify(trimmedDirectory))
          downloadLink.download = "ward_directory.json";
          downloadLink.click();

          console.log("Downloading...");

        }).catch(err => console.warn(err));
    }).catch(err => console.warn(err));
}

document.querySelector("body").appendChild(downloadButton);
