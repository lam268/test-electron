import axios from 'axios'

export function createJoinPeer() {
    const peer = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
}

async function handleNegotiationNeededEvent(peer: any) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
        sdp: peer.localDescription
    };

    const { data } = await axios.post('http://172.16.0.106:3000/consumer', payload);
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch((e: any) => console.log(e));
}

function handleTrackEvent(e: any) {
    console.log(e, 'run 30');
    const video = document.getElementById("watch-stream") as HTMLMediaElement;
    video!.srcObject = e.streams[0];
    video!.onloadedmetadata = () => video!.play();
}