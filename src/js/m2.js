export default function add2(...args) {
  return args.reduce((p, x) => p + x, 1);
}
