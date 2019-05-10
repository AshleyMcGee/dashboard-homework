function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.


    (async function() {

        //get the metadata
        let metaData = await d3.json("/metadata/" + sample)

        //log the data to test the GET. Whadd'ya know, it works when you include a sample manually.
        console.log(metaData)

        //select the node to stick it in
        let sampleMetadata = d3.select("#sample-metadata")

        //clear the previous html
        sampleMetadata.html("")

        //make it to where the metadata populates the box
        metaList = Object.entries(metaData)
        console.log(metaList)

        metaList.forEach(
          obj => {
            p = sampleMetadata.append("p")
            p.text(obj[0] + ": " + obj[1])
          }
        )

    })()

    // BONUS: Build the Gauge Chart

    //buildGauge(data.WFREQ);
}

function buildCharts(sample) {

    (async function() {
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    //get the data for the chart
      let result = await d3.json("/samples/" + sample)
      console.log(result)

      let otu_ids = result.otu_ids
      let sample_values = result.sample_values

      let bubbleSpot = d3.select("#bubble")

      bubbleSpot.html("")

      // @TODO: Build a Bubble Chart using the sample data
      let trace1 = {
        mode: "markers",
        x: otu_ids,
        y: sample_values,
        marker: {
          size: sample_values,
          color: otu_ids
        }

      }

      let bubbleData = [trace1]

      let layout = {

          title: "Amount of Bacteria By Sample Size",
          xaxis: {title: "OTU ID"},
          yaxis: {title: "Sample Size"}

      }

      // @TODO: Build a Pie Chart
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).

      




      Plotly.newPlot("bubble", bubbleData, layout)

    })()

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
