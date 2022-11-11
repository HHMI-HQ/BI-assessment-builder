let findAPITries = 0

function findAPI(windowObject) {
  // Check to see if the window (win) contains the API
  // if the window (win) does not contain the API and
  // the window (win) has a parent window and the parent window
  // is not the same as the window (win)

  let win = windowObject

  while (win.API == null && win.parent !== null && win.parent !== win) {
    // increment the number of findAPITries
    findAPITries += 1

    // Note: 7 is an arbitrary number, but should be more than sufficient
    if (findAPITries > 7) {
      throw new Error('Error finding API -- too deeply nested.')
    }

    // set the variable that represents the window being
    // being searched to be the parent of the current window
    // then search for the API again
    win = win.parent
  }

  return win.API
}

// eslint-disable-next-line no-unused-vars
function getAPI() {
  // start by looking for the API in the current window
  let theAPI = findAPI(window)

  // if the API is null (could not be found in the current window)
  // and the current window has an opener window
  if (
    theAPI == null &&
    window.opener != null &&
    typeof window.opener !== 'undefined'
  ) {
    // try to find the API in the current window’s opener
    theAPI = findAPI(window.opener)
  }

  // if the API has not been found
  if (theAPI == null) {
    // Alert the user that the API Adapter could not be found
    throw new Error('Unable to find an API adapter')
  }

  return theAPI
}

// SCORM requires time to be formatted in a specific way
// eslint-disable-next-line no-unused-vars
function ConvertMilliSecondsToSCORMTime(intTotalMilliseconds, includeFraction) {
  let intHours
  let intMinutes
  let intSeconds
  let intMilliseconds
  let strCMITimeSpan

  let blnIncludeFraction = includeFraction

  if (blnIncludeFraction == null || blnIncludeFraction === undefined) {
    blnIncludeFraction = true
  }

  // extract time parts
  intMilliseconds = intTotalMilliseconds % 1000

  intSeconds = ((intTotalMilliseconds - intMilliseconds) / 1000) % 60

  intMinutes =
    ((intTotalMilliseconds - intMilliseconds - intSeconds * 1000) / 60000) % 60

  intHours =
    (intTotalMilliseconds -
      intMilliseconds -
      intSeconds * 1000 -
      intMinutes * 60000) /
    3600000

  /*
	    deal with exceptional case when content used a huge amount of time and interpreted CMITimstamp 
	    to allow a number of intMinutes and seconds greater than 60 i.e. 9999:99:99.99 instead of 9999:60:60:99
	    note - this case is permissable under SCORM, but will be exceptionally rare
	    */

  if (intHours === 10000) {
    intHours = 9999

    intMinutes = (intTotalMilliseconds - intHours * 3600000) / 60000

    if (intMinutes === 100) {
      intMinutes = 99
    }

    intMinutes = Math.floor(intMinutes)

    intSeconds =
      (intTotalMilliseconds - intHours * 3600000 - intMinutes * 60000) / 1000

    if (intSeconds === 100) {
      intSeconds = 99
    }

    intSeconds = Math.floor(intSeconds)

    intMilliseconds =
      intTotalMilliseconds -
      intHours * 3600000 -
      intMinutes * 60000 -
      intSeconds * 1000
  }

  // drop the extra precision from the milliseconds
  const intHundredths = Math.floor(intMilliseconds / 10)

  // put in padding 0's and concatinate to get the proper format
  strCMITimeSpan =
    // eslint-disable-next-line prefer-template, no-undef
    ZeroPad(intHours, 4) +
    ':' +
    // eslint-disable-next-line no-undef
    ZeroPad(intMinutes, 2) +
    ':' +
    // eslint-disable-next-line no-undef
    ZeroPad(intSeconds, 2)

  if (blnIncludeFraction) {
    strCMITimeSpan += `.${intHundredths.toString()}`
  }

  // check for case where total milliseconds is greater than max supported by strCMITimeSpan
  if (intHours > 9999) {
    strCMITimeSpan = '9999:99:99'

    if (blnIncludeFraction) {
      strCMITimeSpan += '.99'
    }
  }

  return strCMITimeSpan
}
