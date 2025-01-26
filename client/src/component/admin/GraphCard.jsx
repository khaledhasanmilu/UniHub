const GraphCard = ({ title, data, chartType, dataKey, fillColor, xKey, yKey }) => {
  return (
    <div className="col-span-2 bg-white shadow-md rounded-lg p-4">
      <div className="font-semibold text-xl mb-4">{title}</div>
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'bar' ? (
          <BarChart data={data}>
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={yKey} fill={fillColor} />
          </BarChart>
        ) : (
          <LineChart data={data}>
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={yKey} stroke={fillColor} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
