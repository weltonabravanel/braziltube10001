import { HOME_VIDEOS_FAIL, HOME_VIDEOS_REQUEST, HOME_VIDEOS_SUCCESS } from "../ActionType"
import request from "../../Database/Api"

export const getVideosByCategory = (keyword, maxresult) => async (dispatch, getState) => {
    try {
        dispatch({
            type: HOME_VIDEOS_REQUEST
        });
        const res = await request("/search", {
            params: {
                part: "snippet",
                q: keyword === 'All' ? 'Popular Videos' : keyword,
                type: 'video',
                maxResults: maxresult,
                pageToken: getState().homeVideos.nextPageToken,
            }
        });

        const moreDetailsArr = [];
        // const printMoreDetailsArr = [];
        const channelDetailsArr = [];
        // const printChannelDetailsArr = [];
        res.data.items.forEach((videos, index) => {
            const get_video_details = request("/videos", {
                params: {
                    part: 'contentDetails,statistics',
                    id: videos.id.videoId
                }
            });
            moreDetailsArr.push(get_video_details);
            // get_video_details.then(data => { printMoreDetailsArr.push(data) });

            const get_channel_details = request("/channels", {
                params: {
                    part: 'snippet',
                    id: videos.snippet.channelId
                }
            });
            channelDetailsArr.push(get_channel_details);
            // get_channel_details.then(data => {
                // printChannelDetailsArr.push(data);
                // if (index + 1 === res.data.items.length) {console.log({videos: res.data.items, moreDetails: printMoreDetailsArr, channelDetails: printChannelDetailsArr}) }
            // });
        });

        dispatch({
            type: HOME_VIDEOS_SUCCESS,
            payload: {
                videos: res.data.items,
                nextPageToken: res.data.nextPageToken,
                pageInfo: res.data.pageInfo,
                category: keyword,
                etag: res.data.etag,
                moreDetails: moreDetailsArr,
                channelDetails: channelDetailsArr
            }
        })

    } catch (error) {
        console.log(error);
        dispatch({
            type: HOME_VIDEOS_FAIL,
            payload: error.message
        });
    }
}