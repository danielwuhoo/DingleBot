const fs = require("fs");
const average = require('image-average-color');
const request = require("request");
module.exports = {
	voiceJoin: function (voiceChannel) {
		try {
			let connection = voiceChannel.join();
			return connection;
		} catch (e) {
			console.error(e);
			throw new Error("Unable to join voice channel.");
		}
	},
	obtainVideo: async function (yt, input) {
		if (input.length === 0) {
			return null;
		}
		try {
			let playlist = await yt.getPlaylist(input);
			let videos = await playlist.getVideos();
			return videos;

		} catch (e1) {
			try {
				let video = await yt.getVideo(input);
				return video;

			} catch (e2) {
				try {
					let videos = await yt.searchVideos(input, 1);
					let video = await yt.getVideoByID(videos[0].id);
					return video;
				} catch (e3) {
					console.error(e3);
					throw new Error("Unable to find video.");
				}

			}
		}
	},
	obtainSong: function (video) {
		if (video != null) {
			if (Array.isArray(video)) {
				let songs = video.map(v => {
					return {
						title: v.title,
						url: `https://www.youtube.com/watch?v=${v.id}`,
						duration: null,
						thumbnail: v.thumbnails.default.url
					};
				});
				return songs;
			} else {
				let song = {
					title: video.title,
					url: `https://www.youtube.com/watch?v=${video.id}`,
					duration: video.duration,
					thumbnail: video.thumbnails.default.url
				};
				return song;
			}

		}
		return null;
	},
	updateFile: async function (filepath, update) {
		return new Promise((resolve, reject) => {
			fs.readFile(filepath, 'utf8', (e, data) => {
				if (e) {
					reject(e);
				} else {
					let file = JSON.parse(data);
					update(file);
					fs.writeFile(filepath, JSON.stringify(file), 'utf8', e => {
						if (e) {
							reject(e);
						} else {
							resolve();
						}
					});
				}
			})
		})


	},
	durationToString: function (dur) {
		if (dur == null) {
			return 'unknown';
		}
		let string = `${dur.seconds}s`;
		if (dur.minutes) {
			string = `${dur.minutes}m ` + string;
		}
		if (dur.hours) {
			string = `${dur.hours}hr ` + string;
		}
		return string;
	},
	updateMenu: async function (msg, embed, queue, error) {
		embed.setAuthor((queue.channel == null) ? `Not connected to a voice channel` : `Connected to: ${queue.channel}`, "https://i.imgur.com/0eJFKFU.png");

		for (let i = 1; i < queue.songs.length && i < 10; i++) {
			embed.addField(`**${i + 1}. **${queue.songs[i].title}`, `Duration: ${module.exports.durationToString(queue.songs[i].duration)}`);
		}

		embed.setFooter(`${queue.songs.length} song` + ((queue.songs.length == 1) ? "" : "s"));
		embed.setTimestamp();

		if (queue.songs[0] == null) {
			embed.setDescription(`**Queue is currently empty**`);
			embed.setColor("aaaaaa");
		} else {

			embed.setColor(await module.exports.downloadColor(queue.songs[0].thumbnail, './assets/thumb.jpg'));
			embed.setDescription(`**Currently playing: **${queue.songs[0].title}\n**Duration: **${module.exports.durationToString(queue.songs[0].duration)}\n**Requested By: **${queue.songs[0].requestedBy}`);
			embed.setThumbnail(queue.songs[0].thumbnail);
		}

		if (error) {
			embed.addField("Additional Notes:", `\`\`\`${error.message}\`\`\``);
			console.log(error);
		}

		return msg.edit(embed);


	},
	downloadColor: async function (url, path) {
		return new Promise(resolve => {
			request(url).pipe(fs.createWriteStream(path))
				.on('close', () => {
					average(path, (e, col) => {
						resolve(col);

					});
				});
		});

	}
};