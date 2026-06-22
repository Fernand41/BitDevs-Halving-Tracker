const MEMPOOL_API = process.env.MEMPOOL_API;

export async function GET() {
  try {
    const res = await fetch(
      `${MEMPOOL_API}/v1/mining/difficulty-adjustments/3m`,
      { cache: 'no-store' }
    );
    const rawData = await res.json();

    if (!Array.isArray(rawData)) {
      throw new Error('Format de données inattendu');
    }

    const history = rawData
      .filter(entry => Array.isArray(entry) && entry.length >= 4)
      .map(entry => ({
        timestamp:  entry[0],
        date:       new Date(entry[0] * 1000).toLocaleDateString('fr-FR', {
                      day: '2-digit', month: '2-digit'
                    }),
        height:     entry[1],
        difficulty: entry[2],
        adjustment: Math.round(entry[3] * 100) / 100,
      }))
      .slice(-12);

    return Response.json({
      success: true,
      count:   history.length,
      history,
    });

  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}