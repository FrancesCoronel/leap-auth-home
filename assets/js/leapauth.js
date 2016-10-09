var riggedHandPlugin;

Leap.loop({
        hand: function(hand) {
            var label = hand.data('label');
            if (!label) {
                label = document.createElement('label');
                document.body.appendChild(label);
                hand.data('label', label);
            }
            var handMesh = hand.data('riggedHand.mesh');
            var screenPosition = handMesh.screenPosition(
                hand.palmPosition,
                riggedHandPlugin.camera
            );
            label.style.left = screenPosition.x + 'px';
            label.style.bottom = screenPosition.y + 'px';
        }
    })
    .use('riggedHand')
    .use('handEntry')
    .on('handLost', function(hand) {
        var label = hand.data('label');
        if (label) {
            document.body.removeChild(label);
            hand.data({ label: undefined });
        }
    });

riggedHandPlugin = Leap.loopController.plugins.riggedHand;

var paused = false;
var whichhand;
var totalfinger = 0;
var combination_cnt = 1;
var totalcombination = 3;
var authed = false;
var verify = false;

function enterPass() {
    document.getElementById("firstnote").style.visibility = "visible";
}

function greeting() {
    if (verify === true) {
        document.getElementById("greeting").innerHTML = "Welcome home.";
    }
    document.body.style.backgroundColor = "#EFF6F5";
    document.body.style.color = "#333";
    document.body.style.color = "#333";
    document.getElementById("firstnote").innerHTML = "Success!";
    document.getElementById("greeting").style.visibility = "visible";
    document.getElementById("button").style.visibility = "hidden";
}

function auth_check(total) {
    if (total === 7) {
        verify = true;
        greeting();
        authed = true;
    }
}

// Setup Leap loop with frame callback function
var controllerOptions = { enableGestures: true };

Leap.loop(controllerOptions, function(frame) {
    if (paused) {
        return; // Skip this update
    }
    totalfinger = 0;

    if (frame.hands.length > 0) {
        for (var i = 0; i < frame.hands.length; i++) {
            var hand = frame.hands[i];
            if (hand.confidence > 0.4) {
                whichhand = hand.type;
            }
        }
    } else {

    }
    if (frame.pointables.length > 0) {
        for (var j = 0; j < frame.pointables.length; j++) {
            var pointable = frame.pointables[j];
            if (pointable.extended === true) {
                totalfinger++;
            }
        }
    } else {

    }
    if (authed !== 1) {
        auth_check(totalfinger);
    } else if (authed === 1) {
        return;
    }
});
