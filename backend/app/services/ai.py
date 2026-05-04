"""AI service for content generation and optimization."""

import json
import logging
import os
from typing import Any

import requests

logger = logging.getLogger(__name__)

class AIService:
    """Service for AI-powered content generation and analysis."""
    
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.openai_model = os.getenv("OPENAI_MODEL", "gpt-5.2")
        self.openai_timeout = int(os.getenv("OPENAI_TIMEOUT_SECONDS", "45"))
    
    def generate_caption(self, topic: str, style: str = "casual") -> str:
        """Generate Instagram caption using AI."""
        # TODO: Implement caption generation
        return f"Generated caption for {topic}"
    
    def generate_hashtags(self, content: str, count: int = 10) -> list:
        """Generate relevant hashtags using AI."""
        # TODO: Implement hashtag generation
        return [f"#tag{i}" for i in range(count)]
    
    def optimize_content(self, content: str) -> str:
        """Optimize content for Instagram engagement."""
        # TODO: Implement content optimization
        return content
    
    def analyze_sentiment(self, text: str) -> dict:
        """Analyze sentiment of text."""
        # TODO: Implement sentiment analysis
        return {"sentiment": "positive", "score": 0.85}

    def create_creator_ideas(
        self,
        niche: str,
        creator_type: str = "creator",
        target_audience: str = "",
        goal: str = "grow engagement",
        tone: str = "friendly",
        offer: str = "",
        content_pillars: str = "",
        count: int = 6,
    ) -> dict:
        """Create practical Instagram content ideas, using OpenAI when configured."""
        fallback = self._create_local_creator_ideas(
            niche=niche,
            creator_type=creator_type,
            target_audience=target_audience,
            goal=goal,
            tone=tone,
            offer=offer,
            content_pillars=content_pillars,
            count=count,
        )

        if not self.openai_api_key:
            return fallback

        try:
            return self._create_openai_creator_ideas(
                niche=niche,
                creator_type=creator_type,
                target_audience=target_audience,
                goal=goal,
                tone=tone,
                offer=offer,
                content_pillars=content_pillars,
                count=count,
                fallback=fallback,
            )
        except Exception as exc:
            logger.warning("OpenAI idea generation failed; using local fallback: %s", exc)
            return fallback

    def _create_local_creator_ideas(
        self,
        niche: str,
        creator_type: str = "creator",
        target_audience: str = "",
        goal: str = "grow engagement",
        tone: str = "friendly",
        offer: str = "",
        content_pillars: str = "",
        count: int = 6,
    ) -> dict:
        """Create practical Instagram content ideas without requiring an external AI key."""
        clean_niche = niche.strip() or "your niche"
        clean_creator = creator_type.strip() or "creator"
        clean_audience = target_audience.strip() or "your audience"
        clean_goal = goal.strip() or "grow engagement"
        clean_tone = tone.strip() or "friendly"
        clean_offer = offer.strip()
        profile_pillars = [
            pillar.strip()
            for pillar in content_pillars.replace("\n", ",").split(",")
            if pillar.strip()
        ]

        caption = (
            f"I used to make {clean_niche} feel complicated, but the real progress "
            f"started when I focused on one useful step at a time. If you are a "
            f"{clean_creator} helping {clean_audience} and trying to {clean_goal}, "
            f"start with this: show the process, name the lesson, and invite people "
            f"into the next move."
        )
        if clean_offer:
            caption = f"{caption} If this is where you are stuck, my {clean_offer} is built for exactly that."

        seed = clean_niche.lower().replace(" ", "")
        hashtags = [
            f"#{seed}",
            f"#{seed}tips",
            "#creatorjourney",
            "#instagramgrowth",
            "#contentstrategy",
            "#buildinpublic",
            "#reelsideas",
            "#personalbrand",
        ]
        pillars = profile_pillars[:4] or [
            "Teach one practical step",
            "Show behind-the-scenes proof",
            "Share a before-and-after lesson",
            "Ask a specific audience question",
        ]
        formats = ["Reel", "Carousel", "Story", "Static Post", "Reel", "Carousel", "Story"]
        angles = [
            {
                "title": f"Simple {clean_niche} mistake",
                "hook": f"Most {clean_audience} make this {clean_niche} mistake without noticing.",
                "body": (
                    f"Here is the small shift I would make first: pick one repeatable action, "
                    f"track it for seven days, and stop changing the plan before the data teaches you anything."
                ),
                "cta": "Comment 'PLAN' if you want the checklist.",
            },
            {
                "title": f"Behind the {clean_goal} process",
                "hook": f"What I would do first if I wanted to {clean_goal} this month.",
                "body": (
                    f"I would start by clarifying the audience, choosing one offer, and creating "
                    f"three posts that answer the questions people ask before they trust you."
                ),
                "cta": "Save this before planning your next post.",
            },
            {
                "title": f"Personal journey lesson",
                "hook": f"I used to overthink {clean_niche}. This made it simpler.",
                "body": (
                    f"The breakthrough was not doing more. It was making the lesson visible, "
                    f"showing proof, and inviting {clean_audience} into one clear next step."
                ),
                "cta": "Share this with someone building their own routine.",
            },
            {
                "title": f"Audience objection post",
                "hook": f"If you think you need more time for {clean_niche}, read this.",
                "body": (
                    f"You probably need a tighter system, not a bigger schedule. Start with one "
                    f"problem, one useful answer, and one direct next action."
                ),
                "cta": "DM me 'START' if this is the blocker.",
            },
            {
                "title": f"Proof-driven mini case study",
                "hook": f"One result that changed how I explain {clean_niche}.",
                "body": (
                    f"People trust what they can understand. Show the before, explain the decision, "
                    f"and name the result without turning it into a sales pitch."
                ),
                "cta": "Follow for more practical breakdowns.",
            },
            {
                "title": f"Offer bridge",
                "hook": f"This is who my {clean_offer or 'offer'} is actually for.",
                "body": (
                    f"It is for {clean_audience} who want to {clean_goal} without guessing every "
                    f"week. The goal is clarity, consistency, and content that moves people somewhere."
                ),
                "cta": "Message me if you want details.",
            },
        ]

        idea_count = min(max(count, 1), 10)
        ideas = []
        for index in range(idea_count):
            angle = angles[index % len(angles)]
            pillar = pillars[index % len(pillars)]
            idea_hashtags = hashtags[:5] + [f"#{pillar.lower().replace(' ', '').replace('-', '')}"]
            ideas.append(
                {
                    "title": angle["title"],
                    "format": formats[index % len(formats)],
                    "pillar": pillar,
                    "hook": angle["hook"],
                    "caption": (
                        f"{angle['hook']}\n\n"
                        f"{angle['body']}\n\n"
                        f"Tone to keep: {clean_tone}.\n\n"
                        f"{angle['cta']}"
                    ),
                    "cta": angle["cta"],
                    "hashtags": idea_hashtags,
                }
            )

        return {
            "caption": ideas[0]["caption"] if ideas else caption,
            "hooks": [
                f"Nobody tells {clean_audience} this about {clean_niche}.",
                f"Three small shifts that help {clean_creator}s {clean_goal}.",
                f"Steal my {clean_tone} content framework for {clean_niche}.",
            ],
            "hashtags": hashtags,
            "content_pillars": pillars,
            "ideas": ideas,
            "provider": "local",
        }

    def _create_openai_creator_ideas(
        self,
        niche: str,
        creator_type: str,
        target_audience: str,
        goal: str,
        tone: str,
        offer: str,
        content_pillars: str,
        count: int,
        fallback: dict,
    ) -> dict:
        idea_count = min(max(count, 1), 10)
        schema = self._idea_response_schema(idea_count)
        profile = {
            "niche": niche,
            "creator_type": creator_type,
            "target_audience": target_audience,
            "growth_goal": goal,
            "brand_tone": tone,
            "offer": offer,
            "content_pillars": content_pillars,
            "idea_count": idea_count,
        }
        prompt = (
            "Generate Instagram content ideas for this creator profile. "
            "Return practical, specific ideas that feel native to Instagram. "
            "Avoid generic marketing language. Each idea must be distinct, usable as a draft, "
            "and aligned with one content pillar. Include varied formats across Reels, Carousels, "
            "Stories, and Static Posts. Keep captions concise but complete.\n\n"
            f"Creator profile JSON:\n{json.dumps(profile, ensure_ascii=True)}"
        )

        response = requests.post(
            "https://api.openai.com/v1/responses",
            headers={
                "Authorization": f"Bearer {self.openai_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": self.openai_model,
                "input": [
                    {
                        "role": "system",
                        "content": (
                            "You are an Instagram content strategist. Produce only high-signal, "
                            "creator-specific content ideas in the requested JSON schema."
                        ),
                    },
                    {"role": "user", "content": prompt},
                ],
                "text": {
                    "format": {
                        "type": "json_schema",
                        "name": "instagram_idea_generation",
                        "strict": True,
                        "schema": schema,
                    }
                },
            },
            timeout=self.openai_timeout,
        )
        response.raise_for_status()
        payload = response.json()
        generated = self._extract_response_json(payload)
        return self._normalize_openai_payload(generated, fallback, idea_count)

    def _extract_response_json(self, payload: dict[str, Any]) -> dict:
        if payload.get("output_text"):
            return json.loads(payload["output_text"])

        for output in payload.get("output", []):
            for content in output.get("content", []):
                text = content.get("text")
                if text:
                    return json.loads(text)

        raise ValueError("OpenAI response did not include JSON text")

    def _normalize_openai_payload(self, generated: dict, fallback: dict, idea_count: int) -> dict:
        ideas = generated.get("ideas") or []
        if not ideas:
            return fallback

        normalized_ideas = []
        for idea in ideas[:idea_count]:
            normalized_ideas.append(
                {
                    "title": str(idea.get("title") or "Instagram post idea"),
                    "format": str(idea.get("format") or "Post"),
                    "pillar": str(idea.get("pillar") or "Content"),
                    "hook": str(idea.get("hook") or ""),
                    "caption": str(idea.get("caption") or ""),
                    "cta": str(idea.get("cta") or ""),
                    "hashtags": [str(tag) for tag in idea.get("hashtags", [])[:10]],
                }
            )

        hooks = [idea["hook"] for idea in normalized_ideas if idea["hook"]]
        hashtags = []
        for idea in normalized_ideas:
            for tag in idea["hashtags"]:
                if tag not in hashtags:
                    hashtags.append(tag)

        pillars = []
        for idea in normalized_ideas:
            if idea["pillar"] not in pillars:
                pillars.append(idea["pillar"])

        return {
            "caption": normalized_ideas[0]["caption"],
            "hooks": hooks[:5],
            "hashtags": hashtags[:12],
            "content_pillars": pillars[:6],
            "ideas": normalized_ideas,
            "provider": "openai",
        }

    def _idea_response_schema(self, idea_count: int) -> dict:
        return {
            "type": "object",
            "additionalProperties": False,
            "properties": {
                "ideas": {
                    "type": "array",
                    "minItems": idea_count,
                    "maxItems": idea_count,
                    "items": {
                        "type": "object",
                        "additionalProperties": False,
                        "properties": {
                            "title": {"type": "string"},
                            "format": {
                                "type": "string",
                                "enum": ["Reel", "Carousel", "Story", "Static Post"],
                            },
                            "pillar": {"type": "string"},
                            "hook": {"type": "string"},
                            "caption": {"type": "string"},
                            "cta": {"type": "string"},
                            "hashtags": {
                                "type": "array",
                                "minItems": 4,
                                "maxItems": 10,
                                "items": {"type": "string"},
                            },
                        },
                        "required": [
                            "title",
                            "format",
                            "pillar",
                            "hook",
                            "caption",
                            "cta",
                            "hashtags",
                        ],
                    },
                }
            },
            "required": ["ideas"],
        }
