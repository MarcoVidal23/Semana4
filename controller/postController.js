import { db } from "../bd/database.js";

// Format data with HATEOAS structure
const formatJoyasHATEOAS = (joyas) => {
  return {
    totalJoyas: joyas.length,
    stockTotal: joyas.reduce((total, joya) => total + joya.stock, 0),
    results: joyas.map((joya) => ({
      name: joya.nombre,
      href: `/joyas/${joya.id}`,
      id: joya.id,
      stock: joya.stock,
    })),
  };
};

export const getJoyas = async (req, res) => {
  try {
    const { limits=10 , page=1 , order_by ='id_ASC' } = req.query;

    const [field, direction] = order_by.split("_");
    const orderQuery = `ORDER BY ${field} ${direction}`;

    const offset = (page - 1) * limits;

    const query = `SELECT * FROM inventario ${orderQuery}  LIMIT $1 OFFSET $2 `;

    const { rows: joyas } = await db.query(query, [limits, offset]);

    return res.json(formatJoyasHATEOAS(joyas));
  
  } catch (error) {
    console.error("Error getting joyas:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Filter jewelry by various criteria
export const filtrarJoyas = async (req, res) => {
  try {
    const { precio_max, precio_min, categoria, metal } = req.query;

    // Build dynamic query with filters
    let query = "SELECT * FROM inventario WHERE 1=1";
    const params = [];

    // Add filters if they exist
    if (precio_max) {
      params.push(precio_max);
      query += ` AND precio <= $${params.length}`;
    }

    if (precio_min) {
      params.push(precio_min);
      query += ` AND precio >= $${params.length}`;
    }

    if (categoria) {
      params.push(categoria);
      query += ` AND categoria = $${params.length}`;
    }

    if (metal) {
      params.push(metal);
      query += ` AND metal = $${params.length}`;
    }

    const { rows: joyas } = await db.query(query, params);

    return res.json(joyas);
  } catch (error) {
    console.error("Error filtering joyas:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
