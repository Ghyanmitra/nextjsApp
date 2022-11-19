import Image from "next/image";
import { NextSeo } from "next-seo";
import Link from "next/link";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";

export default function Home(props) {
  const [option, setOption] = useState("All");
  // const [option, setOption] = useState("");
  const [seriesValues, setSeries] = useState([]);

  const monthNames = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const revenueType = props.data.reduce((current, value) => {
    if (current[value.revenue_type]) {
      current[value.revenue_type] = [...current[value.revenue_type], value];
    } else {
      current[value.revenue_type] = [value];
    }

    return current;
  }, {});

  // console.log(revenueType);

  const revenues = [];
  for (const key in revenueType) {
    revenues.push(key);
  }

  useEffect(() => {
    if (option == "All") {
      const productdata = props.data.reduce((products, value) => {
        if (products[value.product]) {
          products[value.product] = [
            ...products[value.product],
            [value.month, value.acv, value.product, value.revenue_type],
          ];
        } else {
          products[value.product] = [
            [value.month, value.acv, value.product, value.revenue_type],
          ];
        }

        return products;
      }, {});

      for (let product in productdata) {
        productdata[product].sort(function (a, b) {
          return monthNames[a[0]] - monthNames[b[0]];
        });
      }

      console.log(productdata);
      // productdata.map((value) => console.log(value));

      const seriesData = [];

      for (let product in productdata) {
        const productList = productdata[product].reduce((current, value) => {
          if (current[value[0]]) {
            current[value[0]] = [
              value[0],
              current[value[0]][1] + value[1],
              value[2],
              value[3],
            ];
          } else {
            current[value[0]] = value;
          }

          return current;
        }, {});

        const productSeries = [];
        for (const key in productList) {
          productSeries.push(productList[key]);
        }

        seriesData.push({
          name: product,
          // data: productdata[product],
          data: productSeries,
        });
      }

      setSeries(seriesData);
    } else {
      const productdata = revenueType[option].reduce((products, value) => {
        if (products[value.product]) {
          products[value.product] = [
            ...products[value.product],
            [value.month, value.acv],
          ];
        } else {
          products[value.product] = [[value.month, value.acv]];
        }

        return products;
      }, {});

      for (let product in productdata) {
        productdata[product].sort(function (a, b) {
          return monthNames[a[0]] - monthNames[b[0]];
        });
      }

      const seriesData = [];

      for (let product in productdata) {
        seriesData.push({ name: product, data: productdata[product] });
      }

      setSeries(seriesData);
    }
  }, [option]);

  const options = {
    title: {
      text: option,
    },
    yAxis: {
      title: {
        text: "ACV",
      },
    },
    xAxis: {
      type: "category",
      title: {
        text: "Products",
      },
    },
    series: seriesValues,
  };

  return (
    <>
      <NextSeo
        noindex={false}
        nofollow={false}
        title="Home page"
        description="Description of Home page"
      />

      <div className={"container"}>
        <main className={"main"}>
          <h1 className={"title"}>Welcome to My Portfolio</h1>
          <Link href={"/test"}>Test</Link>

          <select
            name="revType"
            value={option}
            onChange={(e) => setOption(e.target.value)}
          >
            <option value="All">All Revenue</option>
            {revenues.map((value, key) => (
              <option key={key} value={value}>
                {value}
              </option>
            ))}
          </select>

          <HighchartsReact highcharts={Highcharts} options={options} />
        </main>
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  const res = await fetch("http://fetest.pangeatech.net/data");
  const data = await res.json();

  return {
    props: {
      data,
    },
  };
}
