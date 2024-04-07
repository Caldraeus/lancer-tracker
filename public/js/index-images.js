document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded event fired!");

    const baseURL = "http://localhost:3000/artwork/";
    let imageArray = [];
    let counter = 0;

    fetch("/artwork")
        .then(res => res.json())
        .then(files => {
            for (let file of files) {
                let imageURL = baseURL + file;
                imageArray.push(imageURL);
            }
            setInterval(updateSlideshow, 10000);
        })
        .catch(err => {
            console.error(err);
        });

    // Fade and update slideshow
    function updateSlideshow() {
        console.log("Updating slideshow...");
        const slideshowContainer = document.getElementById("slideshow-container");
        const slideshowImg1 = document.getElementById("slideshow-img1"); // Change the id of the first image
        const slideshowImg2 = document.getElementById("slideshow-img2"); // Change the id of the second image
        
        // Overlay two images in order to enable crossfade
        if (slideshowContainer && slideshowImg1 && slideshowImg2) {
            //const currentImageSrc = imageArray[counter];
            let nextImageSrc = imageArray[counter+1];
            if(counter >= imageArray.length-1){nextImageSrc = imageArray[0];} // Change this to get the last image in the array

            // Lines for debugging slideshow images.
            // console.log("Current Image Fading Away:", currentImageSrc);
            // console.log("Next Image Fading In: ", nextImageSrc);

            // Update next image
            slideshowImg2.src = nextImageSrc;
        
            // Set the opacity of the first image to 0 and the second image to 1
            slideshowImg1.style.opacity = 0;
            slideshowImg2.style.opacity = 1;

            // Wait for the fade-out transition to complete before updating the source
            setTimeout(() => {
                // Set the 'src' attribute of the first image element to the current image
                slideshowImg1.src = nextImageSrc;

                // Set the opacity of the first image to 1 and the second image to 0 (outside of the timeout?)

                slideshowImg1.style.opacity = 1;
            }, 1000);

            slideshowImg2.style.opacity = 0;
        
            // Increment the counter by one
            counter = (counter + 1) % imageArray.length;
        }
    }
});