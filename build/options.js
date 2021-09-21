// Hyped News Amplifier - (C) Andrea Ercolino, http://andowebsit.es

function domReady() {
  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => resolve());
    } else {
      resolve();
    }
  });
}

let points;

domReady().then(function() {
  function saveOptions() {
    chrome.storage.local.set({points_weight: parseInt(points.value, 10)});
  }

  function computeComments() {
    const comments = document.querySelector('#comments_weight');
    comments.value = 100 - points.value;
  }

  points = document.querySelector('#points_weight');
  points.addEventListener('change', () => {
    saveOptions();
    computeComments();
  });

  chrome.storage.local.get(['points_weight'], function(response) {
    points.value = response.points_weight || 50;
    computeComments();
  });
});
