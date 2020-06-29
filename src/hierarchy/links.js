export default function() {
  const root = this;
  const links = [];
  root.each((node) => {
    node !== root && links.push({source: node.parent, target: node});
  });
  return links;
}
