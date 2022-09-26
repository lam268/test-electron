const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const webrtc = require('wrtc');
const cors = require('cors')

let senderStream;
let senderWebcam;

app.use(express.static('public'));
app.use(cors({
    origin: '*',
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/consumer/webcam', async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                urls: 'stun:stun.stunprotocol.org',
            },
        ],
    });
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    senderWebcam.getTracks().forEach(track => peer.addTrack(track, senderWebcam));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription,
    }
    res.json(payload);
});

app.post('/consumer', async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                urls: 'stun:stun.stunprotocol.org',
            },
        ],
    });
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    senderStream.getTracks().forEach(track => peer.addTrack(track, senderStream));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription,
    }
    res.json(payload);
});

app.post('/broadcast/webcam', async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                urls: 'stun:stun.stunprotocol.org',
            },
        ],
    });
    peer.ontrack = (e) => handleTrackWebcamEvent(e, peer);
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription,
    }
    res.json(payload);
});

app.post('/broadcast', async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                urls: 'stun:stun.stunprotocol.org',
            },
        ],
    });
    peer.ontrack = (e) => handleTrackEvent(e, peer);
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription,
    }
    res.json(payload);
});


function handleTrackEvent(e, peer) {
    senderStream = e.streams[0]
    console.log(peer, senderStream)
}

function handleTrackWebcamEvent(e, peer) {
    senderWebcam = e.streams[0]
    console.log(peer, senderWebcam)
}


app.listen(3000, () => console.log('server started'));