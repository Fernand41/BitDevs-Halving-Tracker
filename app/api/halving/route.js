const MEMPOOL_API = process.env.MEMPOOL_API;
const HALVING_INTERVAL = parseInt(process.env.HALVING_INTERVAL);
const TARGET_BLOCK_TIME = parseInt(process.env.TARGET_BLOCK_TIME);

export async function GET() {
  try {
    const heightRes = await fetch(`${MEMPOOL_API}/blocks/tip/height`,
      { cache: 'no-store' }
    );
    const currentHeight = parseInt(await heightRes.text());

    const halvingNumber    = Math.floor(currentHeight / HALVING_INTERVAL) + 1;
    const nextHalvingBlock = halvingNumber * HALVING_INTERVAL;
    const blocksRemaining  = nextHalvingBlock - currentHeight;

    const blocksRes = await fetch(`${MEMPOOL_API}/v1/blocks`,
      { cache: 'no-store' }
    );
    const blocks = await blocksRes.json();

    const times = [];
    for (let i = 0; i < Math.min(144, blocks.length - 1); i++) {
      times.push(blocks[i].timestamp - blocks[i + 1].timestamp);
    }
    const avgBlockTime = times.length > 0
      ? times.reduce((a, b) => a + b, 0) / times.length
      : TARGET_BLOCK_TIME;

    const secondsRemaining    = blocksRemaining * avgBlockTime;
    const theoreticalSeconds  = blocksRemaining * TARGET_BLOCK_TIME;

    const estimatedDate   = new Date(Date.now() + secondsRemaining * 1000).toISOString();
    const theoreticalDate = new Date(Date.now() + theoreticalSeconds * 1000).toISOString();

    const currentReward = 50 / Math.pow(2, halvingNumber - 1);
    const nextReward    = currentReward / 2;

    return Response.json({
      success: true,
      current_height:      currentHeight,
      next_halving_block:  nextHalvingBlock,
      halving_number:      halvingNumber,
      blocks_remaining:    blocksRemaining,
      avg_block_time_sec:  Math.round(avgBlockTime),
      seconds_remaining:   Math.round(secondsRemaining),
      estimated_date:      estimatedDate,
      theoretical_date:    theoreticalDate,
      current_reward_btc:  currentReward,
      next_reward_btc:     nextReward,
      early_or_late:       secondsRemaining < theoreticalSeconds ? 'early' : 'late',
      diff_days:           Math.round(Math.abs(secondsRemaining - theoreticalSeconds) / 86400 * 10) / 10,
    });

  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}