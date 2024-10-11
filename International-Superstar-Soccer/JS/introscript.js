setTimeout(function() {
    var initialContainer = document.querySelector('.initial-container');
    var newContainer = document.querySelector('.new-container');

    initialContainer.style.opacity = '0';
    setTimeout(() => {
        initialContainer.style.display = 'none';
    }, 500);

    newContainer.style.display = 'flex';
    setTimeout(() => {
        newContainer.classList.add('show-new-container');
        newContainer.style.opacity = '1';
    }, 10);

    setTimeout(function() {
        var finalContainer = document.querySelector('.final-container');

        newContainer.style.opacity = '0';
        setTimeout(() => {
            newContainer.style.display = 'none';
        }, 500);

        finalContainer.style.display = 'flex';
        setTimeout(() => {
            finalContainer.classList.add('show-final-container');
            finalContainer.style.opacity = '1';
        }, 10);
    }, 3000);

}, 3000);

const audio = document.getElementById('myAudio');
const playButton = document.getElementById('playAudio');
const pauseButton = document.getElementById('pauseAudio');

playButton.addEventListener('click', function() {
    audio.play();
});

pauseButton.addEventListener('click', function() {
    audio.pause();
});
