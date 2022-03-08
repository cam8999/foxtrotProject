# foxtrotProject

### Post JSON object structure
There are a few things that should be present in the object. The fields shouls include (with this exact spelling):
- Location
- Latitude
- Longitude
- Tags
- Title (this is not necessary)

The fields set automatically are:
- UserUID
- ID
- Upvotes
- Upvoters
- Timestamp

id: 10,
UserUID: '43627846',
title: "Climate Change in Bangladesh",
author: 'H. Simpson',
description: 'Research on the effects of Climate Change in Bangladesh.',
location: {name: 'Location B', latitude: '15', longitude: '21'},
tags: ['climate change', 'research'],
textualData: [{prompt: 'How was the information gathered?', answer: 'Observation'},],
hasFiles: false,
media: [],
documents: [],
upvotes: 4,
upvoters: [],
