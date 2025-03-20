from odoo import fields, models


class PricelistItem(models.Model):
    _inherit = "product.pricelist.item"

    start_time = fields.Json(default={"hour": 8, "minute": 30, "second": 15})
