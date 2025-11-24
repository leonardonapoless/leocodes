self.onmessage = async ({ data: files }: MessageEvent<Record<string, string>>) => {
    for (const [key, url] of Object.entries(files)) {
        try {
            const res = await fetch(url)
            const blob = await res.blob()
            self.postMessage({ key, blob })
        } catch (err) {
            console.error('worker fetch error:', key, err)
        }
    }
}
