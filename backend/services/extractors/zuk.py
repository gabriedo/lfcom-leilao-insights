from typing import Dict, Any, List, Tuple
import re
from .base import BaseExtractor

class ZukExtractor(BaseExtractor):
    def __init__(self, *args, url=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.url = url

    def _get_domain(self) -> str:
        return "portalzuk.com.br"

    def extract(self, soup=None, url=None) -> Dict[str, Any]:
        if soup is not None:
            self.soup = soup
        if url is not None:
            self.url = url
        try:
            title = self._extract_title()
            if not title:
                return {
                    "extractionStatus": "failed",
                    "error": "Título não encontrado",
                    "url": self.url
                }
            min_bid = self._extract_min_bid()
            property_type = self._extract_property_type()
            address, city, state = self._extract_location()
            images = self._extract_images()
            auction_date = self._extract_auction_date()
            documents = self._extract_documents()
            data = {
                "title": title,
                "minBid": min_bid,
                "propertyType": property_type,
                "type": property_type,
                "address": address,
                "city": city,
                "state": state,
                "evaluatedValue": 0.0,  # Implementar extração
                "auctionDate": auction_date,
                "documentCount": 0,  # Implementar extração
                "bidCount": 0,  # Implementar extração
                "images": images,
                "documents": documents,
                "extractionStatus": "success",
                "description": "",  # Implementar extração
                "auctionType": "Leilão",
                "auctions": [],  # Implementar extração
                "url": self.url
            }
            return data
        except Exception as e:
            return {
                "extractionStatus": "failed",
                "error": str(e),
                "url": self.url
            }

    def _extract_title(self) -> str:
        title_tag = self.soup.find('h1', class_='property-title')
        if not title_tag:
            title_tag = self.soup.find('h1')
        return self._clean_text(title_tag.get_text()) if title_tag else ""

    def _extract_min_bid(self) -> float:
        # Procura tanto <div> quanto <p> com 'price' na classe
        price_tag = self.soup.find(lambda tag: tag.name in ['div', 'p'] and tag.get('class') and any('price' in c.lower() for c in tag.get('class')))
        if price_tag:
            price_text = price_tag.get_text()
            return self._format_currency(price_text)
        return 0.0

    def _extract_property_type(self) -> str:
        # Procura tanto <span>, <div> quanto <p> com 'type' na classe
        type_tag = self.soup.find(lambda tag: tag.name in ['span', 'div', 'p'] and tag.get('class') and any('type' in c.lower() for c in tag.get('class')))
        if type_tag:
            return self._clean_text(type_tag.get_text())
        return ""

    def _extract_location(self) -> Tuple[str, str, str]:
        address = ""
        city = ""
        state = ""
        # Endereço
        address_tag = self.soup.find(lambda tag: tag.name in ['div', 'p'] and tag.get('class') and any('address' in c.lower() or 'location' in c.lower() for c in tag.get('class')))
        if address_tag:
            address = self._clean_text(address_tag.get_text())
        # Cidade
        city_tag = self.soup.find(lambda tag: tag.name in ['div', 'p'] and tag.get('class') and any('city' in c.lower() for c in tag.get('class')))
        if city_tag:
            city = self._clean_text(city_tag.get_text())
        # Estado
        state_tag = self.soup.find(lambda tag: tag.name in ['div', 'p'] and tag.get('class') and any('state' in c.lower() for c in tag.get('class')))
        if state_tag:
            state = self._clean_text(state_tag.get_text())
        return address, city, state

    def _extract_images(self) -> List[str]:
        images = []
        gallery = self.soup.find('div', class_=lambda x: x and 'gallery' in x.lower())
        if gallery:
            for img in gallery.find_all('img'):
                src = img.get('src', '')
                if src:
                    images.append(src)
        return images 

    def _extract_documents(self) -> List[str]:
        documents = []
        docs_div = self.soup.find('div', class_=lambda x: x and 'documents' in x.lower())
        if docs_div:
            for a in docs_div.find_all('a', href=True):
                documents.append(a['href'])
        return documents

    def _extract_auction_date(self) -> str:
        # Procura tanto <div> quanto <p> com 'auction-date' na classe
        date_tag = self.soup.find(lambda tag: tag.name in ['div', 'p'] and tag.get('class') and any('auction-date' in c.lower() for c in tag.get('class')))
        if date_tag:
            return self._clean_text(date_tag.get_text())
        return "" 