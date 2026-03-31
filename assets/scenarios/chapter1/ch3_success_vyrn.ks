; chapter1/ch3_success_vyrn.ks
[cm]
[chara_show name="roger" storage="roger_normal" pos="left" time="200" wait="false"]
[chara_show name="vyrn" storage="vyrn_normal" pos="right" time="200" wait="true"]
[playse storage="correct"]
[playbgm storage="gyakuten_bgm" loop="true"]
#ロジャー
[focus time="500"]
「チェックメイトだ、ビィ！」
[p]
#
「オマエの周りにはどこにも付いていない……と言ったね？」
[p]
「だが、この『チョコのくず』……オマエの口元に、まだ付いたままだぜ！」
[p]
#ビィ
「えっ！？ ……はっ！！？」
[p]
[playse storage="shock"]
[vibrate time="400"]
[focus time="500"]
#ビィ
「ア、アブネェ……！ おいらとしたことが、証拠隠滅しきれてなかったかぁ～！」
[p]
[chara_show name="ruria" storage="ruria_normal" pos="center" time="200" wait="true"]
#ルリア
「ビィさん！ やっぱりビィさんが食べてしまったんですか？」
[p]
[chara_hide name="ruria" time="200" wait="false"]
[chara_show name="siete" storage="siete_normal" pos="center" time="200" wait="true"]
#シエテ
「やれやれ。トカゲくん、腹ペコだったのかい？」
[p]
#ビィ
「……ううっ、ごめんなぁ！ フェニー、お前！」
[p]
「キッチンを通った時、すっげーいい匂いがして……」
[p]
「気づいたら、ガマンできずにバクバク食っちまってたんだ……！」
[p]
#フェニー
「…………。」
[p]
#フェニー
[chara_hide name="siete" time="200" wait="true"]
[chara_show name="fenny" storage="fenny_smile" pos="center" time="300" wait="true"]
「もー！ ビィくんたら、食いしん坊なんだよ！」
[p]
「でも、正直に言ってくれたから全然いいんだよ。実はいっぱい作ったから、予備もあるんだよ！」
[p]
#ビィ
「ホ、ホントか！？ フェニー、お前最高だぜ！！」
[p]
#ルリア
「よかったですぅ。みんなで仲良く食べましょう？」
[p]
#
━━こうして、演算世界での小さな事件は幕を閉じた。
[p]
誰かを想い、誰かに想われたチョコの味は、[br]きっとどんな高級品よりも甘かったに違いない。
[p]
[chara_hide name="roger" time="200" wait="false"]
[chara_hide name="vyrn" time="200" wait="false"]
[chara_hide name="fenny" time="200" wait="true"]
[stopbgm time="500"]
[jump storage="chapter1/ending.ks"]
