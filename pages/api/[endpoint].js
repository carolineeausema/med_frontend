import httpProxy from 'http-proxy'

const API_URL = 'http://127.0.0.1:8080/' // The actual URL of your API

const proxy = httpProxy.createProxyServer()

// Make sure that we don't parse JSON bodies on this route:
export const config = {
	api: {
		bodyParser: false,
	},
}

console.log("[endpoint] accessed")

export default (req, res) => {
	return new Promise((resolve, reject) => {
		proxy.web(req, res, { target: API_URL, changeOrigin: true }, (err) => {
			if (err) {
				return reject(err)
			}
			resolve()
		})
	})
}