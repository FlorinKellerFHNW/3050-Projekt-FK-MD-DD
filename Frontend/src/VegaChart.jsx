import { useEffect, useRef } from "react";
import embed from "vega-embed";

export const VegaChart = ({ spec, data, name, onClick}) => {
  const container = useRef(null);
  const view = useRef(null);
  const latest = useRef(data);
  latest.current = data;

  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;

  useEffect(() => {
    if (!spec) return;

    let result;

    const startSpec = {
      ...spec,
      datasets: { ...spec.datasets, [name]: latest.current ?? [] },
    };

      embed(container.current, startSpec, { actions: false })
      .then((res) => {
        result = res;
        view.current = res.view;

        res.view.addEventListener("click", (event, item) => {
          if (item && item.datum && onClickRef.current) {
            onClickRef.current(item.datum);
          }
        });
      });


    return () => {
      result?.finalize();
      view.current = null;
    };
  }, [spec, name]);

  useEffect(() => {
    if (view.current && data) {
      view.current
        .data(name, data)
        .runAsync();
    }
  }, [data, name]);

  return <div ref={container} style={{ width: "100%" }} />;
};
