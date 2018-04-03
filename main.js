(function() {
    const tickInterval = 1000;

    let buildable = {
        fire: {
            
        }
    }

    let solidGoods = {
        berries: {
            interval: 2000,
            remainingTime: 2000, //dynamic
            name: 'berries',
            eltId: 'berries',
            consuming: {},
            quantity: 0, //dynamic
            newQuantity: 0, //dynamic
            probability: 1
        },
        sticks: {
            interval: 1000,
            remainingTime: 1000,
            name: 'sticks',
            eltId: 'sticks',
            consuming: {},
            quantity: 0,
            probability: 0.2
        },
        population: {
            quantity: 1, //dynamic
            newQuantity: 1, //dynamic
            eltId: 'population',
            name: 'population',
            consuming: {
                berries: {
                    quantity: 1,
                    interval: 10000,
                    remainingTime: 10000,
                    probability: 1
                }
            },
            interval: 1000,
            remainingTime: 1000, //dynamic
            probability: 0.1
        }
    }

    console.log("I'm bored in a train");

    setInterval (() => {
        // First the creation of ressources
        for (var i = 0; i < Object.keys(solidGoods).length; i++) {
            let solidGood = solidGoods[Object.keys(solidGoods)[i]];

            if (solidGood.remainingTime <= 0) {
                solidGood.remainingTime = solidGood.interval;
                if (Math.random() <= solidGood.probability) {
                    solidGood.newQuantity = solidGood.quantity + 1;
                }
            } else {
                solidGood.remainingTime -= tickInterval;
            }
        }

        // Then the consumming of ressources
        for (var i = 0; i < Object.keys(solidGoods).length; i++) {
            let solidGood = solidGoods[Object.keys(solidGoods)[i]];

            for (var j = 0; j < Object.keys(solidGood.consuming).length; j++) {
                let consumedKey = Object.keys(solidGood.consuming)[j];
                let consumed = solidGood.consuming[consumedKey];

                if (consumed.remainingTime <= 0) {
                    consumed.remainingTime = consumed.interval;
                    if (Math.random() <= consumed.probability) {
                        if (solidGoods[consumedKey].newQuantity >= solidGood.quantity) {
                            solidGoods[consumedKey].newQuantity -= solidGood.quantity; //TODO more "fluid" probability (not 0 or 1)
                        } else {
                            // If their is not enough consumable to sustain the good
                            solidGoods[consumedKey].newQuantity = 0;

                            if (solidGood.newQuantity > 0)
                                solidGood.newQuantity--;
                            else
                                solidGood.newQuantity = 0;
                        }
                    }
                } else {
                    consumed.remainingTime -= tickInterval;
                }
            }
        }

        refreshUi();
    }, tickInterval);

    function refreshUi() {
        for (var i = 0; i < Object.keys(solidGoods).length; i++) {
            let solidGood = solidGoods[Object.keys(solidGoods)[i]];

            if (solidGood.newQuantity != null && solidGood.quantity != solidGood.newQuantity) {
                var elt = document.getElementById(solidGood.eltId);
                elt.innerHTML = solidGood.newQuantity;

                if (solidGood.newQuantity > solidGood.quantity)
                    bubble(document.getElementById(solidGood.eltId + "-particles"), solidGood.newQuantity - solidGood.quantity);
            
                solidGood.quantity = solidGood.newQuantity;
            }
        }
    }

    function bubble(elt, bubblecount) {
        var width = 600;
        var size = ((Math.random()*5 + 10)/10);
        var e = document.createElement('div');
        e.innerHTML = '<span class="particle" style="top:' + (Math.random()*60 + 20) + '%; left:' + (Math.random()*95 + 0) + '%;font-size:' + size + 'em;animation-delay: ' + (((Math.random()*30 + 0))/10) + 's;">+' + bubblecount + '</span>';
        elt.appendChild(e.firstChild);
    }
})();