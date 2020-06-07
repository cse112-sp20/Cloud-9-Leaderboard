import {
  serverIsAvailable,
  softwarePost,
  isResponseOk,
} from "../http/HttpClient";
import {
  getSoftwareDataStoreFile,
  deleteFile,
  getFileDataPayloadsAsJson,
  getFileDataArray,
  getItem,
} from "../Util";
import {
  getTimeDataSummaryFile,
  clearTimeDataSummary,
} from "../storage/TimeSummaryData";
import KeystrokeStats from "../model/KeystrokeStats";

const fs = require("fs");

// batch offline payloads in 8. sqs has a 256k body limit
const batch_limit = 8;

let latestPayload: KeystrokeStats = null;

export function clearLastSavedKeystrokeStats() {
  latestPayload = null;
}

/**
 * send the offline TimeData payloads
 */
export async function sendOfflineTimeData() {
  batchSendArrayData("/data/time", getTimeDataSummaryFile());

  // clear time data data. this will also clear the
  // code time and active code time numbers
  clearTimeDataSummary();
}


/**
 * send the offline data.
 */
export async function sendOfflineData(isNewDay = false) {
  batchSendData("/data/batch", getSoftwareDataStoreFile());
}

/**
 * batch send array data
 * @param api
 * @param file
 */
export async function batchSendArrayData(api, file) {
  let isonline = await serverIsAvailable();
  if (!isonline) {
    return;
  }
  try {
    if (fs.existsSync(file)) {
      const payloads = getFileDataArray(file);
      batchSendPayloadData(api, file, payloads);
    }
  } catch (e) {
  }
}

export async function batchSendData(api, file) {
  let isonline = await serverIsAvailable();
  if (!isonline) {
    return;
  }
  try {
    if (fs.existsSync(file)) {
      const payloads = getFileDataPayloadsAsJson(file);
      batchSendPayloadData(api, file, payloads);
    }
  } catch (e) {
  }
}

export async function getLastSavedKeystrokesStats() {
  const dataFile = getSoftwareDataStoreFile();
  try {
    // try to get the last paylaod from the file first (data.json)
    if (fs.existsSync(dataFile)) {
      const currentPayloads = getFileDataPayloadsAsJson(dataFile);
      if (currentPayloads && currentPayloads.length) {
        // sort in descending order
        currentPayloads.sort(
          (a: KeystrokeStats, b: KeystrokeStats) => b.start - a.start,
        );
        // get the 1st element
        latestPayload = currentPayloads[0];
      }
    }
  } catch (e) {
  }
  // returns one in memory if not found in file
  return latestPayload;
}

export async function batchSendPayloadData(api, file, payloads) {
  // send the batch
  if (payloads && payloads.length > 0) {


    // send batch_limit at a time
    let batch = [];
    for (let i = 0; i < payloads.length; i++) {
      if (batch.length >= batch_limit) {
        let resp = await sendBatchPayload(api, batch);
        if (!isResponseOk(resp)) {
          // there was a problem with the transmission.
          // bail out so we don't delete the offline data
          return;
        }
        batch = [];
      }
      batch.push(payloads[i]);
    }
    // send the remaining
    if (batch.length > 0) {
      let resp = await sendBatchPayload(api, batch);
      if (!isResponseOk(resp)) {
        // there was a problem with the transmission.
        // bail out so we don't delete the offline data
        return;
      }
    }
  }

  // we're online so just delete the file
  deleteFile(file);
}

export function sendBatchPayload(api, batch) {
  // console.log("SEND BATCH LOOK HERE");
  // console.log(batch);
  return softwarePost(api, batch, getItem("jwt")).catch((e) => {
  });
}


export async function storeCurrentPayload(payload) {
  try {
    const content = JSON.stringify(payload, null, 4);
    fs.writeFileSync(this.getCurrentPayloadFile(), content, (err) => {
    });
  } catch (e) {
    //
  }
}
