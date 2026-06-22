const MEMPOOL_API = process.env.MEMPOOL_API;
const TARGET_BLOCK_TIME = parseInt(process.env.TARGET_BLOCK_TIME);

export async function GET() {
  try {
    const heightRes = await fetch(`${MEMPOOL_API}/blocks/tip/height`,
      { cache: 'no-store' }
    );
    const currentHeight = parseInt(await heightRes.text());

    const blocksRes = await fetch(`${MEMPOOL_API}/v1/blocks`,
      { cache: 'no-store' }
    );
    const blocks = await blocksRes.json();

    const times = [];
    for (let i = 0; i < Math.min(6, blocks.length - 1); i++) {
      times.push(blocks[i].timestamp - blocks[i + 1].timestamp);
    }
    const avgBlockTime = times.length > 0
      ? times.reduce((a, b) => a + b, 0) / times.length
      : TARGET_BLOCK_TIME;

    return Response.json({
      success: true,
      current_height: currentHeight,
      avg_block_time: Math.round(avgBlockTime),
      avg_block_time_min: Math.round(avgBlockTime / 60 * 100) / 100,
      last_block_time: blocks[0]?.timestamp ?? null,
    });

  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}