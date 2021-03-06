/** **************************************************************************\
 * Copyright (C) 2019 Scandy
 *
 * THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
 * KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
 * PARTICULAR PURPOSE.
 *
 \*************************************************************************** */

/**
 * Downloads a binary file from provided url as the provided responseType
 * @param {*} url URL to download binary from
 * @param {*} responseType ['arraybuffer', 'blob', 'json', 'text']
 * @param {*} timeout How many milliseconds wait until timeout on request
 */
const downloadBin = (url, responseType='arraybuffer', timeout = 60e3) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    /* NOTE: you want to do this, but you can't.. its forbidden
       https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name
       xhr.setRequestHeaders('accept-encoding','gzip')
    */
    xhr.open('GET', url, true)

    xhr.async = true
    xhr.timeout = timeout
    // xhr.withCredentials = true;
    xhr.responseType = responseType

    xhr.onload = () => {
      if (xhr.response) {
        resolve(xhr.response)
      } else {
        reject(new Error(`No buffer`))
      }
    }

    xhr.onprogress = () => {
      // console.log(`LOADING: ${url}`, xhr.status);
    };

    xhr.onerror = function() {
      if( responseType == 'json' ){
        reject(new Error(`Network request failed: ${JSON.stringify(xhr.responseJSON)}`))
      } else {
        reject(new Error('Network request failed'))
      }
    }

    xhr.ontimeout = function() {
      reject(new Error('Network request timeout'))
    }
    xhr.send()
  })
module.exports.downloadBin = downloadBin

const downloadAudioBuffer = (audioCtx, url) =>
  // thanks to https://middleearmedia.com/web-audio-api-bufferloader/
  // for the original reference
  new Promise((resolve, reject) => {
    downloadBin(url, 'arraybuffer')
      .then(arrayBuffer => {
        // Asynchronously decode the audio file data in arrayBuffer
        audioCtx.decodeAudioData(
          arrayBuffer,
          buffer => {
            if (!buffer) {
              return reject(new Error(`error decoding file data: ${url}`))
            }
            return resolve(buffer)
          },
          error => reject(error, `decodeAudioData error: ${error}`)
        )
      })
      .catch(reject)
  })
module.exports.downloadAudioBuffer = downloadAudioBuffer
