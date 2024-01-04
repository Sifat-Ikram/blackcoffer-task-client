import { useQuery } from '@tanstack/react-query';
import './App.css';
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { useForm } from 'react-hook-form';


function App() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const { register, watch, handleSubmit, control } = useForm();


  const { data: fetchedData = [] } = useQuery({
    queryKey: ['data._id'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:4321/data');
      return res.data;
    },
  });

  const selectedEndYear = watch('endYear');
  const selectedTopic = watch('topic');
  const selectedSector = watch('sector');
  const selectedRegion = watch('region');
  const selectedPestle = watch('pestle');
  const selectedSource = watch('source');
  const selectedCountry = watch('country');



  const filteredEndYear = fetchedData.filter(data => data.end_year == selectedEndYear);

  const filteredTopic = fetchedData.filter(data => data.topic == selectedTopic);

  const filteredSector = fetchedData.filter(data => data.sector == selectedSector);

  const filteredCountry = fetchedData.filter(data => data.country == selectedCountry);

  const filteredRegion = fetchedData.filter(data => data.region == selectedRegion);

  const filteredPestle = fetchedData.filter(data => data.pestle == selectedPestle);

  const filteredSource = fetchedData.filter(data => data.source == selectedSource);

  
  const filterIntensity = filteredSource.map(data => data.intensity )
  const filterRelevance = filteredSource.map(data => data.relevance)
  const filterLikelihood = filteredSource.map(data => data.likelihood)

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const data = {
      labels: ['Intensity', 'Relevance', 'Likelihood'],
      datasets: [
        {
          label: selectedCountry,
          data: [filterIntensity[0], filterRelevance[0], filterLikelihood[0]],
          backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
        },
        {
          label: selectedRegion,
          data: [filterIntensity[0], filterRelevance[0], filterLikelihood[0]],
          backgroundColor: ['rgb(75, 192, 192)', 'rgb(153, 102, 255)', 'rgb(255, 159, 64)'],
        },
        {
          label: selectedSector,
          data: [filterIntensity[0], filterRelevance[0], filterLikelihood[0]],
          backgroundColor: ['rgb(255, 120, 120)', 'rgb(120, 120, 255)', 'rgb(255, 240, 120)'],
        }
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: 'Multi-Series Pie Chart',
        },
      },
    };

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: options,
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [filterIntensity, filterRelevance, filterLikelihood]);

  return (
    <div className='w-11/12 mx-auto space-y-5'>
      <h1 className='text-4xl font-semibold text-center'>Dashboard Chart</h1>
      <div className='gap-10'>
      <div className='mb-20'>
        <h1 className='text-2xl font-semibold text-left'>Filters</h1>
        <form onSubmit={handleSubmit()}>
          <div className='flex flex-wrap gap-2'>
            <div className='flex-1'>
              <label className="label">
                <span className="label-text">End Year</span>
              </label>
              <select {...register('endYear')} className="w-full select select-bordered">
                {fetchedData.map(data => (
                  <option key={data._id} value={data.end_year}>
                    {data.end_year}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex-1'>
              <label className="label">
                <span className="label-text">Country</span>
              </label>
              <select {...register("country")} className="w-full select select-bordered">
                {
                  filteredEndYear.map(data => <option key={data._id} value={data.country}>{data.country}</option>)
                }
              </select>
            </div>
            <div className='flex-1'>
              <label className="label">
                <span className="label-text">Region</span>
              </label>
              <select {...register("region")} className="w-full select select-bordered">
                {
                  filteredCountry.map(data => <option key={data._id} value={data.region}>{data.region}</option>)
                }
              </select>
            </div>
            <div className='flex-1'>
              <label className="label">
                <span className="label-text">Sector</span>
              </label>
              <select {...register("sector")} className="w-full select select-bordered">
                {
                  filteredRegion.map(data => <option key={data._id} value={data.sector}>{data.sector}</option>)
                }
              </select>
            </div>
            <div className='flex-1'>
              <label className="label">
                <span className="label-text">Topics</span>
              </label>
              <select {...register("topic")} className="w-full select select-bordered">
                {
                  filteredSector.map(data => <option key={data._id} value={data.topic}>{data.topic}</option>)
                }
              </select>
            </div>
            <div className='flex-1'>
              <label className="label">
                <span className="label-text">Pestle</span>
              </label>
              <select {...register("pestle")} className="w-full select select-bordered">
                {
                  filteredTopic.map(data => <option key={data._id} value={data.pestle}>{data.pestle}</option>)
                }
              </select>
            </div>
            <div className='flex-1'>
              <label className="label">
                <span className="label-text">Source</span>
              </label>
              <select {...register("source")} className="w-full select select-bordered">
                {
                  filteredPestle.map(data => <option key={data._id} value={data.source}>{data.source}</option>)
                }
              </select>
            </div>
          </div>
        </form>
      </div>
      <div className='space-y-10'>
        <h1 className='text-4xl font-semibold text-center'>Pie chart for the given data</h1>
        <div className='h-[500px] w-[500px] mx-auto'>
          <canvas ref={chartRef} width="400" height="400"></canvas>;
        </div>
      </div>
      </div>
    </div>
  )
}

export default App
