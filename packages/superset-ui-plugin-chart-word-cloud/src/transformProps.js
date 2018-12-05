function transformData(data, formData) {
  const { metric, series } = formData;

  const transformedData = data.map(datum => ({
    size: datum[metric.label || metric],
    text: datum[series],
  }));

  return transformedData;
}

export default function transformProps(chartProps) {
  const { width, height, formData, payload } = chartProps;
  const { colorScheme, rotation, sizeTo, sizeFrom } = formData;

  return {
    colorScheme,
    data: transformData(payload.data, formData),
    height,
    rotation,
    sizeRange: [sizeFrom, sizeTo],
    width,
  };
}
