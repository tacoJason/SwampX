# Tender 

##### Inspiration

From infamous stray cats to local gators, students on campus have become familiar with the creatures who also call Gainesville their home. One animal that has become the unofficial third mascot of the University of Florida is [Tenders], a stray cat who is also the namesake of our app. UF students and faculty have garnered a large sense of affection for this fine feline, and we are passionate in sharing that love. Our app acts as a platform where the UF community can connect and collaborate in cherishing UF’s local animals. 

Created for Swamphacks from 1/25/25 to 1/26/25. 


##### Installation
To clone this repo, run 
````
git clone git@github.com:tacoJason/SwampX.git
````

Once inside the cloned repo, install the dependencies
````
npm install
````

To run the app, first download the [Expo app][expo] on your phone. Once that's set up, run  
````
npx expo start
````

and scan the QR code in terminal. That should be everything.



##### What it does
Opening the app, you’re first greeted with the main swiping feed page. Our feed is heavily inspired by Tinder’s feed, with the ability to either like an image or not interact with it. It also displays the current like count and the name of the closest building that the picture was taken near. Once interacting with the image, it iterates to the next post on our Firebase Realtime Database. There are two other tabs besides the feed. The camera tab allows users to take photos in the app. These photos are then pushed to Imgur through its API, allowing us to upload the image link provided by the API to Firebase, alongside the users latitude and longitude coordinates. This data is what feeds our feed, with our platform focusing on user-generated photos. The map tab then displays a geolocated pointer for each image on the database, alongside a heatmap of circles which indicates locations with high image traffic (meaning areas with lots of animals!).

##### How we built it
To bring ‘tender’ to life, we utilized the react native framework. We used various APIs on the backend to build the foundation for our app features, and then integrated them into the app using Javascript as our main programming language. These included the react-native-maps api for our maps page, the Imgur api for storing photos taken through the app, and Geoapify to obtain building/ address names based on latitude and longitude coordinate data. We also heavily utilized Google’s Firebase Realtime Database to store our image data in an organized platform and implement real time updates with each new photo taken.

##### Challenges we ran into

This hackathon was many ‘firsts’ for all of us on this team. It was our first hackathon, our first time working with databases, and almost all of us came in with no background in front-end development. Being unfamiliar to software development processes, we faced many challenges traversing through Github commands and merge conflicts. There were also hurdles in navigating, understanding, and parsing through the information being pushed and pulled from Firebase. Another challenge we faced was implementing APIs since none of our members had prior experience.
We also faced design conflicts and setbacks. Initially, we created an infinitely scrolling feed that would continue to load data from Firebase until it reached the end of the database. We completed this design and its product is in the project’s repository, however, when it came to packaging the final app, we ended up not using it, instead opting for a Tinder-esque feed. We wanted to have both present in the app but there was no fluid way of doing so without creating a whole new tab on the bottom.

##### Accomplishments that we're proud of

One of our greatest accomplishments is creating a database structure to store Imgur links and map coordinates. By integrating this with the React Native camera and map APIs, we allow users to upload photos and generate a heatmap based on all submitted images. We’re also proud of the Tinder theming and the interactivity of the feed. Besides our completed features, we’re also extremely proud of the resourcefulness and resilience of our members as we traversed new frameworks, platforms, and programming languages.

##### What we learned

We learned a lot about front-end and ios development, managing databases, the react-native environment, and interacting with many different apis. We had to understand what was being returned from the database, and figure out how to break down that information to be readily utilized in our other features. We also familiarized ourselves with Javascript (most of us only knew Python and C++ prior to this event), and learned a lot about how to manage usages on API keys and transform the data retrieved.



##### What's next for tender

We plan on refining our current features, such as making the swipe feed more seamless, as well as developing new ones. We’d like to add user authentication, the ability for users to leave comments, implement our infinite feed idea, and use computer vision with machine learning to detect different animal species. 




   [tenders]: <https://www.alligator.org/article/2024/03/beloved-uf-cat-tenders-returns-home-after-brief-campus-cat-napping/>
   
   [expo]: <https://expo.dev/tools>
