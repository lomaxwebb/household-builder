
/* Select needed DOM elements. */
var body = document.getElementsByTagName('body')[0];
var form = document.getElementsByTagName('form')[0];
var addButton = document.getElementsByClassName('add')[0];
addButton.type = "button";     //Prevent form from submitting each time 'add' button is pressed by changing its 'type' attribute from 'submit' to 'button'.

/* Create JSON variable. */
var jsonData = [];
var itemsCreated = 0;

/* Create new elements to display the household list and any warnings. */
var householdListDiv = document.createElement('div');
var warning = document.createElement('div');
warning.innerHTML = 'No warnings.';     //Warning element must have some text at all times in order to keep its place on the screen from changing size when it becomes hidden.
warning.style.color = 'red';
warning.style.visibility = 'hidden';

/* Remove an element when user clicks associated button. */
var removeButtonPressed = function() {
 var removeIndex = jsonData.map(
  function(item) {
   return item.id;
  }
 ).indexOf(parseInt(this.id));
 jsonData.splice(removeIndex, 1);
 this.previousSibling.previousSibling.remove();
 this.previousSibling.remove();
 this.remove();
};

/* Create onclick function for 'add' button. */
var addButtonPressed = function() {
 var age = document.querySelectorAll('[name="age"]')[0].value;
 var relationshipField = document.querySelectorAll('[name="rel"]')[0];
 var relationship = relationshipField.options[relationshipField.selectedIndex].text;
 var isSmoker = document.querySelectorAll('[name="smoker"]')[0].checked;
 var inputIsValid = validateInput(age, relationship);
 if (inputIsValid) {
  jsonData.push(
   {
    "age": parseInt(age),
    "id": (++itemsCreated),
    "isSmoker": isSmoker,
    "relationship": relationship
   }
  );
  var householdMember = relationship + ', age ' + age + '. ' + ((isSmoker) ? 'Smoker.' : '');
  var removalButton = document.createElement('button');
  removalButton.innerHTML = 'delete ';
  removalButton.id = itemsCreated;
  removalButton.onclick = removeButtonPressed;
  householdListDiv.append(householdMember);
  householdListDiv.append(removalButton);
  householdListDiv.append(document.createElement('br'));
 }
};

/* Create onsubmit function. */
var onsubmit = function() {
 postToServer(JSON.stringify(jsonData));
 return false;
};

/* Validate user input. If input is invalid, display warning message. */
function validateInput(age, relationship) {
 var inputIsValid = false;
 var warningText = '';
 if (age == '') {
  warningText = 'So sorry, but age is required.';
 }
  else if (isNaN(age)) {
   warningText = 'Pardon me, but "' + age + '" is not a number.';
  }
   else if (age < 1) {
    warningText = 'You might as well hear it: age must be greater than zero.';
   } 
    else if (relationship == '---') {
     warningText = 'I hate to be the one to break it to you, but relationship must be specified.';
    }
     else {
      inputIsValid = true;
     }
 if (inputIsValid) {
  warning.style.visibility = 'hidden';
 }
  else {
   warning.innerHTML = warningText;
   warning.style.visibility = 'visible';
  }
 return inputIsValid;
}

/* Create function pretending to be a remote server call. Actually we're just using the debug element to display the JSON. */
function postToServer(jsonString) {
 console.log('We\'re really posting the JSON data to the server. Yep, we\'re really doing it...');
 var debugElement = document.getElementsByClassName('debug')[0];
 document.body.appendChild(debugElement);
 debugElement.innerHTML = 'JSON to post to server:' + '\n\n';
 var jsonStringSplit = jsonString.split('},');
 for(var i=0; i<jsonStringSplit.length; i++) {
  debugElement.innerHTML += jsonStringSplit[i];
  if (i < jsonStringSplit.length-1) {
   debugElement.innerHTML += '},\n';
  }
 }
 debugElement.style.top = '0';
 debugElement.style.display = 'initial';
 debugElement.style.position = 'absolute';
 debugElement.style.right = '0';
}

/* Append newly-created elements. */
body.append(document.createElement('br'));
body.append(warning);
body.append(document.createElement('br'));
body.append(householdListDiv);
householdListDiv.append('List of household members:');
householdListDiv.append(document.createElement('br'));

/* Assign functions to their elements. */
form.onsubmit = 'onsubmit; return false;';
addButton.onclick = addButtonPressed;
