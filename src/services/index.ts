import { IMusicService } from './IMusicService';
import { MockMusicService } from './MockMusicService';

// Swap this line to switch from mock data to a real API
const musicService: IMusicService = new MockMusicService();

export default musicService;
export type { IMusicService };
