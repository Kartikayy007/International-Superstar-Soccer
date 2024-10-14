console.log("Intro Script is running!");

setTimeout(function() {
    var initialContainer = document.querySelector('.initial-container');
    var newContainer = document.querySelector('.new-container');
    console.log("Initial container fading out...");

    initialContainer.style.opacity = '0';
    setTimeout(() => {
        initialContainer.style.display = 'none';
        console.log("Initial container hidden.");
    }, 500);

    newContainer.style.display = 'flex';
    setTimeout(() => {
        newContainer.classList.add('show-new-container');
        newContainer.style.opacity = '1';
        console.log("New container displayed.");
    }, 10);

    setTimeout(function() {
        var finalContainer = document.querySelector('.final-container');
        console.log("New container fading out...");

        newContainer.style.opacity = '0';
        setTimeout(() => {
            newContainer.style.display = 'none';
            console.log("New container hidden.");
        }, 500);

        finalContainer.style.display = 'flex';
        setTimeout(() => {
            finalContainer.classList.add('show-final-container');
            finalContainer.style.opacity = '1';
            console.log("Final container displayed.");
        }, 10);
    }, 3000);

}, 3000);

const audio = document.getElementById('myAudio');
const playButton = document.getElementById('playAudio');
const pauseButton = document.getElementById('pauseAudio');

playButton.addEventListener('click', function() {
    audio.play();
    console.log("Audio playing.");
});

pauseButton.addEventListener('click', function() {
    audio.pause();
    console.log("Audio paused.");
});
