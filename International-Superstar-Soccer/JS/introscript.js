// Function to switch from initial to new container after 3 seconds
setTimeout(function() {
    var initialContainer = document.querySelector('.initial-container');
    var newContainer = document.querySelector('.new-container');

    // Fade out the initial container
    initialContainer.style.opacity = '0';
    setTimeout(() => {
        initialContainer.style.display = 'none'; // Fully hide it after fade-out
    }, 500);  // Delay matches the fade-out duration (0.5 seconds)

    // Show the new container
    newContainer.style.display = 'flex'; // Set display to flex for the new container
    setTimeout(() => {
        newContainer.classList.add('show-new-container'); // Add class for fade-in effect
        newContainer.style.opacity = '1'; // Make it visible
    }, 10); // Small delay to trigger the fade-in effect

    // Function to switch from new to final container after 3 seconds
    setTimeout(function() {
        var finalContainer = document.querySelector('.final-container');

        // Fade out the new container
        newContainer.style.opacity = '0';
        setTimeout(() => {
            newContainer.style.display = 'none'; // Fully hide it after fade-out
        }, 500);  // Delay matches the fade-out duration (0.5 seconds)

        // Show the final container
        finalContainer.style.display = 'flex'; // Set display to flex for the final container
        setTimeout(() => {
            finalContainer.classList.add('show-final-container'); // Add class for fade-in effect
            finalContainer.style.opacity = '1'; // Make it visible
        }, 10); // Small delay to trigger the fade-in effect
    }, 3000); // Switch to final container after 3 seconds

}, 3000); // Switch from initial to new container after 3 seconds
