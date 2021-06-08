const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
xhr.send();
xhr.onload = () => {
    const json = JSON.parse(xhr.responseText);
    console.log(json);
}

const svg = d3.select('body').append('svg');