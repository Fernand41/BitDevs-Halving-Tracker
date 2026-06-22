const MEMPOOL_API = process.env.MEMPOOL_API;
const TARGET_BLOCK_TIME   = parseInt(process.env.TARGET_BLOCK_TIME);
const DIFFICULTY_EPOCH    = parseInt(process.env.DIFFICULTY_EPOCH);
const DEVIATION_THRESHOLD = parseInt(process.env.DEVIATION_THRESHOLD);

export async function GET() {
  try {
    const heightRes = await fetch(`${MEMPOOL_API}/blocks/tip/height`,
      { cache: 'no-store' }
    );
    const currentHeight = parseInt(await heightRes.text());

    const blocksIntoEpoch   = currentHeight % DIFFICULTY_EPOCH;
    const blocksUntilAdjust = DIFFICULTY_EPOCH - blocksIntoEpoch;
    const epochNumber       = Math.floor(currentHeight / DIFFICULTY_EPOCH);

    const [diffRes, blocksRes] = await Promise.all([
      fetch(`${MEMPOOL_API}/v1/difficulty-adjustment`, { cache: 'no-store' }),
      fetch(`${MEMPOOL_API}/v1/blocks`, { cache: 'no-store' }),
    ]);

    const diffData = await diffRes.json();
    const blocks   = await blocksRes.json();

    const sampleSize = Math.min(blocksIntoEpoch, 144, blocks.length - 1);
    const times = [];
    for (let i = 0; i < sampleSize; i++) {
      times.push(blocks[i].timestamp - blocks[i + 1].timestamp);
    }
    const avgBlockTime = times.length > 0
      ? times.reduce((a, b) => a + b, 0) / times.length
      : TARGET_BLOCK_TIME;

    const deviationPercent   = ((avgBlockTime - TARGET_BLOCK_TIME) / TARGET_BLOCK_TIME) * 100;
    const estimatedAdjustment = -deviationPercent;
    const alertTriggered     = Math.abs(deviationPercent) >= DEVIATION_THRESHOLD;

    return Response.json({
      success: true,
      current_height:        currentHeight,
      epoch_number:          epochNumber,
      blocks_into_epoch:     blocksIntoEpoch,
      blocks_until_adjust:   blocksUntilAdjust,
      avg_block_time_sec:    Math.round(avgBlockTime),
      avg_block_time_min:    Math.round(avgBlockTime / 60 * 100) / 100,
      target_block_time_sec: TARGET_BLOCK_TIME,
      deviation_percent:     Math.round(deviationPercent * 100) / 100,
      estimated_adjustment:  Math.round(estimatedAdjustment * 100) / 100,
      alert_triggered:       alertTriggered,
      alert_threshold:       DEVIATION_THRESHOLD,
      difficulty_data:       diffData,
      direction:             avgBlockTime < TARGET_BLOCK_TIME ? 'faster' : 'slower',
      message:               avgBlockTime < TARGET_BLOCK_TIME
        ? "Blocs plus rapides que prévu → difficulté va monter"
        : "Blocs plus lents que prévu → difficulté va baisser",
    });

  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}